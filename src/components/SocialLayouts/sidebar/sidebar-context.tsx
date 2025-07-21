"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { createContext, useContext, useEffect, useState } from "react";

type SidebarState = "expanded" | "collapsed";

type SidebarContextType = {
  state: SidebarState;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarSocialContext = createContext<SidebarContextType | null>(null);

export function useSidebarSocialContext() {
  const context = useContext(SidebarSocialContext);
  if (!context) {
    throw new Error(
      "useSidebarSocialContext must be used within a SidebarSocialProvider",
    );
  }
  return context;
}

export function SidebarSocialProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  function toggleSidebar() {
    setIsOpen((prev) => !prev);
  }

  return (
    <SidebarSocialContext.Provider
      value={{
        state: isOpen ? "expanded" : "collapsed",
        isOpen,
        setIsOpen,
        isMobile,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarSocialContext.Provider>
  );
}
