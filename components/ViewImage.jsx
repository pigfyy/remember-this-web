import React from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { useAtom } from "jotai";
import { isDialogOpenAtom, imageIndexAtom } from "@/lib/jotai/viewImage";

import { useUserImages } from "@/lib/firebase/firestore";

const ViewImage = () => {
  const [isDialogOpen, setIsDialogOpen] = useAtom(isDialogOpenAtom);
  const [imageIndex] = useAtom(imageIndexAtom);
  const [images, loading, error] = useUserImages();

  const imageLink = images[imageIndex] ? images[imageIndex].link : "";

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <div className="mt-6">
          <Image src={imageLink} alt="User image" width={500} height={500} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewImage;
