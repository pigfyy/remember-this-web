import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import Gallery from "@/components/Gallery";

const Main = () => {
  return (
    <div className="mx-auto py-4 sm:py-8 md:py-16 max-w-[95%] sm:max-w-[90%] md:max-w-[75%] lg:max-w-[50%]">
      <Gallery />
    </div>
  );
};

export default Main;
