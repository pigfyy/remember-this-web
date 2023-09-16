import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBox from "@/components/SearchBox";
import Gallery from "@/components/Gallery";
import ResultDisplay from "@/components/ResultDisplay";
import Tabs from "@/components/Tabs";

import { useAtom } from "jotai";
import { mainTabAtom } from "@/lib/jotai/mainTab";

const Main = () => {
  const [mainTab, setMainTab] = useAtom(mainTabAtom);

  return (
    <ScrollArea className="flex-1 overflow-y-auto">
      <main className="mx-auto py-4 sm:py-8 md:py-16 max-w-[95%] sm:max-w-[90%] md:max-w-[75%] lg:max-w-[50%] flex flex-col gap-5">
        <Tabs />
        <SearchBox />
        {mainTab === "gallery" ? <Gallery /> : null}
        {mainTab === "result" ? <ResultDisplay /> : null}
      </main>
    </ScrollArea>
  );
};

export default Main;
