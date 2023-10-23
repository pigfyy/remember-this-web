"use client";

import { Toaster } from "@/components/ui/toaster";

import Header from "@/components/Header";
import Main from "@/components/Main";
import UploadFile from "@/components/UploadFile";
import ViewImage from "@/components/ViewImage";

import { client } from "@/lib/utils/weaviate";

import { deleteAllUserObjects } from "@/lib/utils/weaviate";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebase";

const Home = () => {
  const [user, loading, error] = useAuthState(auth);

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
