import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CornerRightDown } from "lucide-react";

import { useAtom } from "jotai";
import { questionAtom, resImgAtom, resTextAtom } from "@/lib/jotai/viewResult";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebase";

import { search } from "@/lib/utils/weaviate";

import { capitalizeFirstLetter } from "@/lib/utils/processing";

function b64toBlob(base64String, contentType) {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: contentType });
}

const SearchBox = () => {
  const [question, setQuestion] = useAtom(questionAtom);
  const [resImg, setResImg] = useAtom(resImgAtom);
  const [resText, setResText] = useAtom(resTextAtom);
  const [user] = useAuthState(auth);
  const inputRef = useRef(null);

  const performSearch = async (searchString) => {
    const capitalizedId = capitalizeFirstLetter(user.uid);
    const b64 = await search(searchString, capitalizedId);
    const blob = b64toBlob(b64, "image/png");
    const blobUrl = URL.createObjectURL(blob);

    setResImg({ blobUrl, b64 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const searchString = inputRef.current?.value;
    setQuestion(searchString);

    if (searchString === "") return;

    await performSearch(searchString);

    inputRef.current.value = "";
  };

  return (
    <form className="flex gap-3 w-full items-center" onSubmit={handleSubmit}>
      <Input placeholder="What are you looking for?" ref={inputRef} />
      <Button type="submit" size="icon">
        <CornerRightDown />
      </Button>
    </form>
  );
};

export default SearchBox;
