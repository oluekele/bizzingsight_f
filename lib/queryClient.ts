// import { QueryClient, QueryFunction } from "@tanstack/react-query";

// async function throwIfResNotOk(res: Response) {
//   if (!res.ok) {
//     const text = (await res.text()) || res.statusText;
//     throw new Error(`${res.status}: ${text}`);
//   }
// }

// export async function apiRequest(
//   method: string,
//   url: string,
//   data?: unknown | undefined,
//   options?: { responseType?: "json" | "blob" },
// ): Promise<any> {
//   const token = localStorage.getItem("auth_token");
//   const headers: Record<string, string> = {
//     ...(data ? { "Content-Type": "application/json" } : {}),
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };

//   const res = await fetch(url, {
//     method,
//     headers,
//     body: data ? JSON.stringify(data) : undefined,
//     credentials: "include",
//   });

//   await throwIfResNotOk(res);

//   const contentType = res.headers.get("content-type");
//   if (options?.responseType === "blob" || contentType?.includes("application/pdf")) {
//     return res.blob();
//   }

//   return res.json();
// }

// type UnauthorizedBehavior = "returnNull" | "throw";
// export const getQueryFn: <T>(options: {
//   on401: UnauthorizedBehavior;
// }) => QueryFunction<T> =
//   ({ on401: unauthorizedBehavior }) =>
//   async ({ queryKey }) => {
//     const token = localStorage.getItem("auth_token");
//     const headers: Record<string, string> = {
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     };

//     const res = await fetch(queryKey.join("/") as string, {
//       credentials: "include",
//       headers,
//     });

//     if (unauthorizedBehavior === "returnNull" && res.status === 401) {
//       return null;
//     }

//     await throwIfResNotOk(res);
//     return await res.json();
//   };

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       queryFn: getQueryFn({ on401: "throw" }),
//       refetchInterval: false,
//       refetchOnWindowFocus: false,
//       staleTime: Infinity,
//       retry: false,
//     },
//     mutations: {
//       retry: false,
//     },
//   },
// });
