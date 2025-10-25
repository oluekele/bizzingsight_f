"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

const getRefreshToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Fetch the current user info from token
// export const useUser = () => {
//   return useQuery({
//     queryKey: ["user"],
//     queryFn: async () => {
//       const token = getAccessToken();
//       if (!token) throw new Error("No access token");
//       const payload = parseJwt(token);
//       if (!payload) throw new Error("Invalid token");
//       return { role: payload.role, email: payload.email, name: payload.name };
//     },
//     retry: false,
//   });
// };

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) throw new Error("No access token");

      const payload = parseJwt(token);
      if (!payload) throw new Error("Invalid token");

      return {
        id: payload.sub,
        role: payload.role || "User",
        email: payload.email || "unknown@example.com",
        name: payload.name || "Anonymous",
      };
    },
    retry: false,
  });
};

// Login mutation
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data } = await api.post("/auth/login", { email, password });
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Logged in successfully");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(
        `Login failed: ${
          error.response?.data?.message || "Invalid credentials"
        }`
      );
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const token = getAccessToken();
      if (token) {
        await api.post(
          "/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    },
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      queryClient.clear();
      toast.success("Logged out");
      router.push("/");
    },
  });
};

// Refresh token mutation (used automatically by axios interceptor too)
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token");
      const { data } = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
      });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      return data.access_token;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      queryClient.clear();
    },
  });
};

// Reset password
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => {
      const { data } = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });
};

// Resend token
export const useResendToken = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post("/auth/resend-token", { email });
      return data;
    },
    onSuccess: () => {
      toast.success("Reset token resent to your email");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to resend token");
    },
  });
};
