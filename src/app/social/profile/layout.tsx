import RightPanel from "@/components/Social/RightPanel/RightPanel";
import { Sidebar } from "@/components/SocialLayouts/sidebar";
import "@/css/satoshi.css";
import "@/css/style.css";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

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
    <div className="flex w-full justify-between bg-gray-2 dark:bg-[#020d1a]">
      <Sidebar />

      <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-6 md:px-16">
        {children}
      </main>

      {/* <RightPanel /> */}
    </div>
  );
}
