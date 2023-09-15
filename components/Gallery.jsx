import React from "react";
import Image from "next/image";
import SearchBox from "./SearchBox";

import { useAtom, atom } from "jotai";
import { isDialogOpenAtom, imageIndexAtom } from "@/lib/jotai/viewImage";

import { useUserImages } from "@/lib/firebase/firestore";

const ImageMap = ({ data }) => {
  const [, setIsDialogOpen] = useAtom(isDialogOpenAtom);
  const [, setImageIndex] = useAtom(imageIndexAtom);

  const handleClick = (i) => {
    setIsDialogOpen(true);
    setImageIndex(i);
  };

  return (
    <>
      {data.map((img, i) => (
        <button onClick={() => handleClick(i)} key={crypto.randomUUID()}>
          <Image
            src={img.link}
            width={250}
            height={250}
            alt="Picture of the author"
            className="object-cover aspect-square w-full"
          />
        </button>
      ))}
    </>
  );
};

const Gallery = () => {
  const [data, loading, error] = useUserImages();

  return (
    <div className="flex gap-5 flex-col">
      <SearchBox />
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-[1px] md:gap-1">
        {data && <ImageMap data={data} />}
      </div>
    </div>
  );
};

export default Gallery;
