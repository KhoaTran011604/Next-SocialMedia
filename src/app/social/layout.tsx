import "@/css/satoshi.css";
import "@/css/style.css";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

import { Providers } from "./providers";
import { Header } from "@/components/SocialLayouts/header";
import { Sidebar } from "@/components/SocialLayouts/sidebar";

import RightPanel from "@/components/Social/RightPanel/RightPanel";
import Pointer from "@/components/Social/Pointer";

export const metadata: Metadata = {
  title: {
    template: "%s | FaceBook Clone",
    default: "Settings",
  },
  description: "",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      {/* <Pointer /> */}
      <Header />

      <div className="-z-20 flex min-h-screen">{children}</div>
    </Providers>
  );
}
