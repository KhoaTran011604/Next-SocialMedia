import "@/css/satoshi.css";
import "@/css/style.css";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

import { Providers } from "./providers";
import { Header } from "@/components/SocialLayouts/header";
import { Sidebar } from "@/components/SocialLayouts/sidebar";
import { cn } from "@/styles/lib/utils";

export const metadata: Metadata = {
  title: {
    template: "%s | NextAdmin - Next.js Dashboard Kit",
    default: "NextAdmin - Next.js Dashboard Kit",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <Header />
      <div className="flex min-h-screen">
        <div className="flex w-full justify-between bg-gray-2 dark:bg-[#020d1a]">
          <Sidebar />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>

          {/* <div>
            <aside className="max-w-[290px] space-y-4 overflow-hidden bg-transparent p-4 transition-[width] duration-200 ease-linear dark:text-white/90">
              <div className="flex-col rounded-lg border border-gray-200 bg-white py-10 pl-[25px] pr-[7px] dark:border-gray-800 dark:bg-gray-900">
                <div className="h-64 w-94 p-4">Content </div>
              </div>
              <div className="flex-col rounded-lg border border-gray-200 bg-white py-10 pl-[25px] pr-[7px] dark:border-gray-800 dark:bg-gray-900">
                <div className="h-64 w-94 p-4">Content 2 </div>
              </div>
            </aside>
          </div> */}
          <aside
            className={
              "sticky top-0 h-screen w-full max-w-[290px] overflow-hidden bg-transparent p-4 transition-[width] duration-200 ease-linear dark:text-white/90"
            }
          >
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white py-10 pl-[25px] pr-[7px] dark:border-gray-800 dark:bg-gray-900">
              {/* Navigation */}
              <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
                More and more
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Providers>
  );
}
