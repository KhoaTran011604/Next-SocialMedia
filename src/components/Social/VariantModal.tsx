import { VariantModalProps } from "@/types/MainType";
import React from "react";

export default function VariantModal({
  open,
  setOpen,
  variant = "base",
  title,
  children,
  onClose = () => {},
  onConfirm,
  textButtomClose = "Close",
  textButtomConfirm = "Save Changes",
  hiddenButtomConfirm = false,
  hiddenButtomClose = false,
  size = "sm",
}: VariantModalProps) {
  if (!open) return null;
  const variants: any = {
    base: "",
    success: "bg-green-600",
    warning: "bg-yellow-300",
    error: "bg-red-400",
  };

  const sizes: any = {
    sm: "max-w-[600px]",
    medium: "max-w-[900px]",
    lg: "max-w-[70vw]",
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto p-5">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 opacity-70 backdrop-blur-[32px]"
        onClick={() => {
          setOpen(false);
          onClose();
        }}
      ></div>
      <div
        className={`custom-scrollbar relative max-h-[calc(100vh-20px)] w-full ${sizes[size]} overflow-y-auto rounded-3xl bg-white dark:bg-gray-900`}
      >
        {/* Close button */}
        <div
          className={`full w-full pl-6 pr-6 pt-6 lg:pl-10 lg:pr-10 lg:pt-10 ${variants[variant]}`}
        >
          <button
            onClick={() => {
              setOpen(false);
              onClose();
            }}
            className="absolute right-3 top-3 z-10 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
              />
            </svg>
          </button>
          <h4 className="text-title-sm mb-7 py-4 font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>
        </div>

        <div className="pb-6 pl-6 pr-6 lg:pb-10 lg:pl-10 lg:pr-10">
          <div className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            {children}
          </div>

          <div className="mt-8 flex w-full items-center justify-end gap-3">
            {!hiddenButtomClose && (
              <button
                onClick={() => {
                  setOpen(false);
                  onClose();
                }}
                type="button"
                className="shadow-theme-xs flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:w-auto"
              >
                {textButtomClose}
              </button>
            )}

            {!hiddenButtomConfirm && (
              <button
                onClick={onConfirm}
                type="button"
                className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full justify-center rounded-lg px-4 py-3 text-sm font-medium text-white sm:w-auto"
              >
                {textButtomConfirm}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
