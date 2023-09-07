"use client";

import { Toaster } from "@/components/ui/toaster";

import Header from "@/components/Header";
import UploadFile from "@/components/UploadFile";

import { getConcepts } from "@/lib/utils/imageRecognition";

const Home = () => {
  const IMAGE_URL =
    "https://images.pexels.com/photos/2852474/pexels-photo-2852474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  getConcepts(IMAGE_URL)
    .then((concepts) => console.log(concepts))
    .catch((error) => console.error(error));

  return (
    <>
      <div>
        <Header />
        <UploadFile />
      </div>
      <Toaster />
    </>
  );
};

export default Home;
