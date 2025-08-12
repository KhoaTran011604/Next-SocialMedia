"use client";

import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SidebarSocialProvider } from "@/components/SocialLayouts/sidebar/sidebar-context";

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
    <SidebarSocialProvider>
      <ToastContainer />
      {children}
    </SidebarSocialProvider>
    // </AuthProvider>
  );
}
