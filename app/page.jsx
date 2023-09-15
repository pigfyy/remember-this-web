"use client";

import { Toaster } from "@/components/ui/toaster";

import Header from "@/components/Header";
import Main from "@/components/Main";
import UploadFile from "@/components/UploadFile";
import ViewImage from "@/components/ViewImage";

const Home = () => {
  // const test = async () => {
  //   if (loading) return;

  //   const result = await client.graphql
  //     .get()
  //     .withClassName("OjMssz8VLET5oohgwj5TdJOFyH83")
  //     .withFields(["name", "image"])
  //     .withNearText({ concepts: ["dog"] })
  //     .withLimit(1)
  //     .do();

  //   console.log(result);
  // };

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
