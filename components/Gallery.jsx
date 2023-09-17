import React, { useCallback, useEffect } from "react";
import Image from "next/image";

import { useAtom } from "jotai";
import { isDialogOpenAtom, imageIndexAtom } from "@/lib/jotai/viewImage";
import { userImageUrlsAtom } from "@/lib/jotai/userImages";

import { auth } from "@/lib/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useUserImages } from "@/lib/firebase/firestore";

import { client, queryUserImages } from "@/lib/utils/weaviate";

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

import { capitalizeFirstLetter } from "@/lib/utils/processing";

const Gallery = () => {
  const [user] = useAuthState(auth);
  const [userImages] = useUserImages();
  const [userImageUrls, setUserImageUrls] = useAtom(userImageUrlsAtom);

  useEffect(() => {
    const temp = async () => {
      let images = [];

      for (const userImage of userImages) {
        const id = userImage.id;

        const result = await client.data
          .getterById()
          .withClassName(capitalizeFirstLetter(user.uid))
          .withId(id)
          .do();

        const b64 = result.properties.image;
        const url = b64ToBlobUrl(b64);

        images.push(url);
      }

      setUserImageUrls(images);
    };

    console.log(userImages);
    if (userImages.length) {
      temp();
    }
  }, [userImages, user]);

  console.log(userImageUrls);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-[1px] md:gap-1">
      {/* {userImages.length ? <ImageMap data={userImages} /> : null} */}
    </div>
  );
};

export default Gallery;
