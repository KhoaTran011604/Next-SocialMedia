import { Dialog } from "../ui/dialog";
interface ModalProps {
  open: boolean;
  setOpen: (status: boolean) => void;
  children: any;
}
export function Modal({ open, setOpen, children }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div>
        {/* <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>New Task</Button>
        </DialogTrigger> */}
        {children}
      </div>
    </Dialog>
  );
}
