"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { createContext, useCallback, useContext, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface DrawerContextType {
  openDrawer: (content: React.ReactNode, options?: DrawerOptions) => void;
  closeDrawer: () => void;
}

interface DrawerOptions {
  title?: string;
  onClose?: () => void;
  position?: "left" | "right"; // ✅ Hỗ trợ hướng
}

const DrawerContext = createContext<DrawerContextType | null>(null);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context)
    throw new Error("useDrawer must be used within a DrawerProvider");
  return context;
};

export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);
  const [options, setOptions] = useState<DrawerOptions>({ position: "right" });

  const openDrawer = useCallback(
    (content: React.ReactNode, opts?: DrawerOptions) => {
      setDrawerContent(content);
      setOptions({ position: "right", ...opts }); // ✅ Mặc định là 'right'
      setIsOpen(true);
    },
    [],
  );

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    options?.onClose?.();
  }, [options]);

  // ✅ Tailwind xử lý hướng drawer
  const positionClass =
    options.position === "left"
      ? "inset-y-0 left-0 flex max-w-full pr-10 sm:pr-16"
      : "inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16";

  const closeButtonPositionClass =
    options.position === "left"
      ? "right-0 top-0 -mr-8 sm:-mr-10 pl-4 pt-4"
      : "left-0 top-0 -ml-8 sm:-ml-10 pr-4 pt-4";

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}

      <Dialog open={isOpen} onClose={closeDrawer} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={`pointer-events-none fixed ${positionClass}`}>
              <DialogPanel className="pointer-events-auto relative w-screen max-w-md transform bg-white shadow-xl transition-all duration-300 ease-in-out dark:bg-gray-900">
                <TransitionChild>
                  <div className={`absolute ${closeButtonPositionClass} flex`}>
                    <button
                      onClick={closeDrawer}
                      className="rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                      <span className="sr-only">Close panel</span>
                      <IoMdClose />
                    </button>
                  </div>
                </TransitionChild>

                <div className="flex h-full flex-col overflow-y-auto py-6">
                  <div className="px-4 sm:px-6">
                    <DialogTitle className="text-base font-semibold text-gray-900 dark:text-white">
                      {options.title || "Drawer"}
                    </DialogTitle>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {drawerContent}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </DrawerContext.Provider>
  );
};
