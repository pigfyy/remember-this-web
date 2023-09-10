"use client";

import { Toaster } from "@/components/ui/toaster";

import Header from "@/components/Header";
import Main from "@/components/Main";
import UploadFile from "@/components/UploadFile";
import ViewImage from "@/components/ViewImage";

const Home = () => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <Main />
      </div>

      {/* Floating components */}
      <>
        <Toaster />
        <UploadFile />
        <ViewImage />
      </>
    </>
  );
};

export default Home;
