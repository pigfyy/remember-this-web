import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAtom } from "jotai";
import { isDialogOpenAtom, imageIndexAtom } from "@/lib/jotai/viewImage";

const ViewImage = () => {
  const [isDialogOpen, setIsDialogOpen] = useAtom(isDialogOpenAtom);
  const [imageIndex] = useAtom(imageIndexAtom);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewImage;
