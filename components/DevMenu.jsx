import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { Menu } from "lucide-react";

import {
  deleteUserImageDoc,
  getUserImageDocs,
  deleteUserImage,
} from "@/lib/devMenu/firebase";
import { deleteRecords } from "@/lib/utils/pinecone";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebase";
import { useToast } from "./ui/use-toast";

const DeleteAllImages = () => {
  const [user] = useAuthState(auth);
  const { toast } = useToast();

  const handleClick = async () => {
    const images = await getUserImageDocs();

    if (!images.length) return;

    const recordIds = [];

    for (const image of images) {
      await deleteUserImageDoc(image.id);
      await deleteUserImage(image.id);

      recordIds.push(image.id);
    }

    await deleteRecords(user.uid, recordIds);

    toast({
      title: "Delete Successful!",
    });
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      Delete All Images
    </Button>
  );
};

const DevMenu = () => {
  return (
    <Popover>
      <PopoverTrigger className="fixed top-24 right-5 translate-x-[-50%]">
        <div className="flex gap-2 text-slate-400">
          <Menu /> Dev Menu
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <DeleteAllImages />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DevMenu;
