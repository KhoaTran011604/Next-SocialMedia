"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl";
export type ModalVariant = "base" | "danger" | "success" | "info"; // mở rộng nếu cần

export interface ModalProps {
  variant: string; // mặc định: "base"
  title?: string;
  children: ReactNode;
  onClose?: () => void; // mặc định: () => {}
  onConfirm?: () => void;

  textButtomClose?: string; // mặc định: "Close"
  textButtomConfirm?: string; // mặc định: "Save Changes"

  hiddenButtomConfirm?: boolean; // mặc định: false
  hiddenButtomClose?: boolean; // mặc định: false

  size: string; // mặc định: "sm"
}
interface ModalContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onClose: any;
  setOnClose: Dispatch<SetStateAction<any>>;
  setContent: (content: ReactNode) => void;
  content: ReactNode | null;
  customStyle: ModalProps;
  setCustomStyle: Dispatch<SetStateAction<ModalProps>>;
}
const initCustomStyle = {
  variant: "base",
  title: "",
  children: <></>,
  onClose: () => {},
  onConfirm: () => {},
  textButtomClose: "Close",
  textButtomConfirm: "Save Changes",
  hiddenButtomConfirm: false,
  hiddenButtomClose: false,
  size: "sm",
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [onClose, setOnClose] = useState<any>(() => {});
  const [content, setContentState] = useState<ReactNode | null>(null);
  const [customStyle, setCustomStyle] = useState<ModalProps>(initCustomStyle);

  const setContent = (modalContent: ReactNode) => {
    setContentState(modalContent);
    setOpen(true);
  };

  return (
    <ModalContext.Provider
      value={{
        open,
        setOpen,
        onClose,
        setOnClose,
        setContent,
        content,
        customStyle,
        setCustomStyle,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
