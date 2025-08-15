import RightPanel from "@/components/Social/RightPanel/RightPanel";
import { Sidebar } from "@/components/SocialLayouts/sidebar";
import "@/css/satoshi.css";
import "@/css/style.css";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    template: "",
    default: "Profile",
  },
  description: "",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}
