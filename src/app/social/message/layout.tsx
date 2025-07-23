import { Sidebar } from "@/components/SocialLayouts/sidebar";
import "@/css/satoshi.css";
import "@/css/style.css";
import { Metadata } from "next";
import { PropsWithChildren } from "react";
import HistoryMessage from "./HistoryMessage";
import UserOnlineSidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: {
    template: "",
    default: "Message",
  },
  description: "",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full justify-between bg-gray-2 dark:bg-[#020d1a]">
      <Sidebar />
      <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-6 md:px-16">
        {children}
      </main>
      <UserOnlineSidebar />
    </div>
  );
}
