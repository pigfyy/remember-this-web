import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CornerRightDown, Loader2 } from "lucide-react";

import { useAtom } from "jotai";
import {
  isLoadingAtom,
  questionAtom,
  resImgAtom,
  resTextAtom,
} from "@/lib/jotai/viewResult";
import { mainTabAtom } from "@/lib/jotai/mainTab";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebase";

import { getEmbedding } from "@/lib/utils/embedding";
import { search } from "@/lib/utils/weaviate";

import { capitalizeFirstLetter, b64ToBlobUrl } from "@/lib/utils/processing";

import { vqa } from "@/lib/utils/hf";

const SearchBox = () => {
  const [, setQuestion] = useAtom(questionAtom);
  const [, setMainTab] = useAtom(mainTabAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [, setResImg] = useAtom(resImgAtom);
  const [, setResText] = useAtom(resTextAtom);
  const [user] = useAuthState(auth);
  const inputRef = useRef(null);

  const performSearch = async (embedding) => {
    const capitalizedId = capitalizeFirstLetter(user.uid);
    const { image, imageUrl } = await search(embedding, capitalizedId);

    const blobUrl = b64ToBlobUrl(image);

    return { imageUrl, blobUrl, b64: image };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const searchString = inputRef.current?.value;
    if (searchString === "") return;

    setIsLoading(true);
    setQuestion(searchString);

    const embedding = await getEmbedding({ text: searchString });
    const imgResult = await performSearch(embedding);
    setResImg(imgResult);

    console.log(imgResult);

    const textResult = (await vqa(searchString, imgResult.blobUrl)).res;
    setResText(textResult);

    inputRef.current.value = "";
    setIsLoading(false);
    setMainTab("result");
  };

  return (
    <form className="flex gap-3 w-full items-center" onSubmit={handleSubmit}>
      <Input placeholder="What are you looking for?" ref={inputRef} />
      {isLoading ? (
        <Loader2 className="w-10 h-10 animate-spin" />
      ) : (
        <Button type="submit" size="icon">
          <CornerRightDown />
        </Button>
      )}
    </form>
  );
};

export default SearchBox;
