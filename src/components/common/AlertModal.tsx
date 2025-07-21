import { AlertDialog } from "../ui/alert-dialog";
interface ModalProps {
  openAlert: boolean;
  setOpenAlert: (status: boolean) => void;
  children: any;
}
export function AlertModal({ openAlert, setOpenAlert, children }: ModalProps) {
  return (
    <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
      {children}
    </AlertDialog>
  );
}
