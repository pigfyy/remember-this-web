import React from "react";
import Image from "next/image";

import { useAtom } from "jotai";
import { questionAtom, resImgAtom, resTextAtom } from "@/lib/jotai/viewResult";

const ResultDisplay = () => {
  const [question] = useAtom(questionAtom);
  const [resImg] = useAtom(resImgAtom);
  const [resText] = useAtom(resTextAtom);

  return (
    <>
      {question.length ? (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xl">Your Question:</p>
            <p className="font-bold text-lg">{question}</p>
          </div>

          <Image src={resImg.blobUrl} alt="" width={400} height={400} />

          <div>
            <p className="text-xl">Answer:</p>
            <p className="font-bold text-lg">{resText.answer}</p>
            <div className="h-3"></div>
            <p className="text-md">Confidence:</p>
            <p className="text-sm font-bold">
              {Math.round(resText.score * 100)}%
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ResultDisplay;
