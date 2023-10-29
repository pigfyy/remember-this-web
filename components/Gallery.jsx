import React from "react";
import Image from "next/image";
import { Trash } from "lucide-react";

import { useAtom, atom } from "jotai";
import { isDialogOpenAtom, imageIndexAtom } from "@/lib/jotai/viewImage";

import { useUserImages } from "@/lib/firebase/firestore";
import { deleteUserImage, deleteUserImageDoc } from "@/lib/devMenu/firebase";
import { useToast } from "./ui/use-toast";
import { deleteRecords } from "@/lib/utils/pinecone";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebase";

const ImageMap = ({ data }) => {
  const [, setIsDialogOpen] = useAtom(isDialogOpenAtom);
  const [, setImageIndex] = useAtom(imageIndexAtom);
  const { toast } = useToast();
  const [user] = useAuthState(auth);

  const handleOpenImage = (i) => {
    setIsDialogOpen(true);
    setImageIndex(i);
  };

  const handleImageDelete = async (i) => {
    const imgId = data[i].id;

    await deleteUserImageDoc(imgId);
    await deleteUserImage(imgId);
    await deleteRecords(user.uid, [imgId]);

    toast({
      title: "Successfully deleted!",
      variant: "destructive",
    });
  };

  return (
    <>
      {data.map((img, i) => (
        <div key={crypto.randomUUID()} className="group relative">
          <Image
            src={img.imageUrl}
            alt="Picture of the author"
            className="object-cover aspect-square w-full group-hover:brightness-75 transition-all duration-200 ease-in-out"
            width={1000}
            height={1000}
            onClick={() => handleOpenImage(i)}
          />
          {/* trash button */}
          <button
            onClick={() => handleImageDelete(i)}
            className="absolute top-3 right-3 bg-white group-hover:hover:opacity-100 rounded-md p-1 group-hover:opacity-40 opacity-0 transition-all ease-in-out duration-200"
          >
            <Trash size={15} color="red" />
          </button>
        </div>
      ))}
    </>
  );
};

const Gallery = () => {
  const [data, loading, error] = useUserImages();

  return (
    <div className="flex gap-5 flex-col">
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-[1px] md:gap-1">
        {data && <ImageMap data={data} />}
      </div>
    </div>
  );
};

export default Gallery;
