"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
//import { AuthProvider } from "../context/auth";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 phút dữ liệu không "stale"
            //cacheTime: 1000 * 60 * 30, // 30 phút trước khi cache bị xoá
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    // <AuthProvider>
    <SidebarProvider>
      <ToastContainer />
      {children}
    </SidebarProvider>
    // </AuthProvider>
  );
}
