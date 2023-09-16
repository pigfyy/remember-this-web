import React from "react";
import clsx from "clsx";

import { useAtom } from "jotai";
import { mainTabAtom } from "@/lib/jotai/mainTab";

const Tabs = () => {
  const [mainTab, setMainTab] = useAtom(mainTabAtom);

  const setTabGallery = () => setMainTab("gallery");
  const setTabResult = () => setMainTab("result");

  return (
    <div className="w-full bg-neutral-100 flex p-1 gap-1 text-sm">
      <button
        className={clsx("flex-1 py-1 rounded-md transition-all", {
          "bg-white": mainTab === "gallery",
        })}
        onClick={setTabGallery}
      >
        Gallery
      </button>
      <button
        className={clsx("flex-1 py-1 rounded-md transition-all", {
          "bg-white": mainTab === "result",
        })}
        onClick={setTabResult}
      >
        Results
      </button>
    </div>
  );
};

export default Tabs;
