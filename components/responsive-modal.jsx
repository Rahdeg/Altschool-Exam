import { useMedia } from "react-use";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent } from "./ui/drawer";

export const ResponsiveModal = ({ children, open, onOpenChange }) => {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle></DialogTitle>
        <DialogContent className=" w-full sm:max-w-lg p-0 border-none rounded-2xl overflow-y-auto  scrollbar-none max-h-[85vh]">
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DialogTitle></DialogTitle>
        <div className=" overflow-y-auto  scrollbar-none max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
