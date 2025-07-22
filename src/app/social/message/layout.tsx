import { Sidebar } from "@/components/SocialLayouts/sidebar";
import "@/css/satoshi.css";
import "@/css/style.css";
import { Metadata } from "next";
import { PropsWithChildren } from "react";
import HistoryMessage from "./HistoryMessage";

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
      <aside
        className={
          "sticky top-0 hidden h-screen w-full max-w-[290px] overflow-hidden bg-transparent p-0 transition-[width] duration-200 ease-linear dark:text-white/90 lg:block lg:p-4"
        }
      >
        <HistoryMessage
          users={[
            { initials: "AM", name: "Alex Morgan" },
            { initials: "JL", name: "Jessica Lee" },
            { initials: "RT", name: "Ryan Thompson" },
          ]}
        />
      </aside>
    </div>
  );
}
