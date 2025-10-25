"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const validateToken = async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("No access token found");
        setIsAuthenticated(false);
        setUserRole(null);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          console.log("Token expired, attempting refresh");
          await refresh();
        } else {
          setUserRole(payload.role);
          setIsAuthenticated(true);
          console.log("Token valid, userRole:", payload.role);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        await refresh(); // Try refreshing if token parsing fails
      }
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", { email });
      const { data } = await api.post("/auth/login", { email, password });
      if (!data.access_token || !data.refresh_token) {
        throw new Error("No tokens received");
      }
      console.log("Login response:", {
        access_token: data.access_token.substring(0, 20) + "...",
        refresh_token: data.refresh_token.substring(0, 20) + "...",
      });
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      setUserRole(payload.role);
      setIsAuthenticated(true);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(
        `Login failed: ${
          error.response?.data?.message || "Invalid credentials"
        }`
      );
    }
  };

  const refresh = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token");
      }
      console.log("Attempting token refresh");
      const { data } = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
      });
      if (!data.access_token || !data.refresh_token) {
        throw new Error("No tokens received");
      }
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      setUserRole(payload.role);
      setIsAuthenticated(true);
      console.log("Token refreshed, userRole:", payload.role);
      return data.access_token;
    } catch (error: any) {
      console.error("Refresh error:", error.response?.data || error.message);
      setIsAuthenticated(false);
      setUserRole(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      queryClient.clear();
      toast.error("Session expired, please log in again");
      router.push("/");
      return null;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await api.post(
          "/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsAuthenticated(false);
      setUserRole(null);
      queryClient.clear();
      toast.success("Logged out");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const register = async (
    email: string,
    password: string,
    fullNmae: string
  ) => {
    try {
      const { data } = await api.post("/auth/register", {
        email,
        password,
        fullNmae,
      });
      toast.success("Account created successfully");
      router.push("/");
    } catch (error: any) {
      console.error("Register error:", error.response?.data || error.message);
      toast.error(
        `Registration failed: ${
          error.response?.data?.message || "Error creating account"
        }`
      );
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Password reset token sent to your email");
    } catch (error: any) {
      console.error(
        "Forgot password error:",
        error.response?.data || error.message
      );
      toast.error(
        `Error: ${
          error.response?.data?.message || "Failed to send reset token"
        }`
      );
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      toast.success("Password reset successfully");
      router.push("/");
    } catch (error: any) {
      console.error(
        "Reset password error:",
        error.response?.data || error.message
      );
      toast.error(
        `Error: ${error.response?.data?.message || "Failed to reset password"}`
      );
    }
  };

  const resendToken = async (email: string) => {
    try {
      await api.post("/auth/resend-token", { email });
      toast.success("Reset token resent to your email");
    } catch (error: any) {
      console.error(
        "Resend token error:",
        error.response?.data || error.message
      );
      toast.error(
        `Error: ${error.response?.data?.message || "Failed to resend token"}`
      );
    }
  };

  return {
    isAuthenticated,
    userRole,
    login,
    refresh,
    logout,
    register,
    forgotPassword,
    resetPassword,
    resendToken,
  };
};
