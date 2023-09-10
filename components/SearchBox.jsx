import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CornerRightDown } from "lucide-react";

const SearchBox = () => {
  return (
    <div className="flex gap-3 w-full items-center">
      <Input placeholder="What are you looking for?" />
      <Button type="submit" size="icon">
        <CornerRightDown />
      </Button>
    </div>
  );
};

export default SearchBox;
