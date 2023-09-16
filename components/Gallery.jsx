import React, { useEffect } from "react";
import Image from "next/image";

import { useAtom } from "jotai";
import { isDialogOpenAtom, imageIndexAtom } from "@/lib/jotai/viewImage";
import { userImageUrlsAtom } from "@/lib/jotai/userImages";

import { auth } from "@/lib/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useUserImages } from "@/lib/firebase/firestore";

import { queryUserImages } from "@/lib/utils/weaviate";

import { b64ToBlobUrl } from "@/lib/utils/processing";

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
            src={img}
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
  const [userImageUrls, setUserImageUrls] = useAtom(userImageUrlsAtom);

  const [user] = useAuthState(auth);

  useEffect(() => {
    const getUserImages = async () => {
      const data = await queryUserImages(user.uid);

      const blobs = data?.map((imageObj) => {
        const b64 = imageObj.image;

        return b64ToBlobUrl(b64);
      });

      setUserImageUrls(blobs);
    };

    if (user) getUserImages();
  }, [user, setUserImageUrls]);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-[1px] md:gap-1">
      {userImageUrls.length ? <ImageMap data={userImageUrls} /> : null}
    </div>
  );
};

export default Gallery;
