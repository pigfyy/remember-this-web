import React from "react";
import Image from "next/image";

import { useAtom } from "jotai";
import { questionAtom, resImgAtom, resTextAtom } from "@/lib/jotai/viewResult";

const ResultDisplay = () => {
  const [question, setQuestion] = useAtom(questionAtom);
  const [resImg, setResImg] = useAtom(resImgAtom);
  const [resText, setResText] = useAtom(resTextAtom);

  return (
    <>
      {question.length ? (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xl">Your Question:</p>
            <p className="font-bold text-lg">{question}</p>
          </div>

          <Image src={resImg.blobUrl} alt="" width={400} height={400} />
        </div>
      ) : null}
    </>
  );
};

export default ResultDisplay;
