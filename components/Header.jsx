import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";

import SignIn from "@/components/SignIn";
import SignOut from "@/components/SignOut";

import { useAtom } from "jotai";
import { isDialogOpenAtom } from "@/lib/jotai/uploadFileDialog";

import { auth } from "@/lib/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Header = () => {
  const [user, loading, error] = useAuthState(auth);

  const [, setIsDialogOpen] = useAtom(isDialogOpenAtom);

  const uploadFile = () => setIsDialogOpen(true);

  return (
    <header className="p-4 shadow-md flex justify-between gap-6">
      <div className="flex items-center gap-3 mr-8">
        <div className="flex-shrink-0">
          <Image
            src="/logo.png"
            width={35}
            height={35}
            alt="Picture of the author"
          />
        </div>
        <h1 className="font-bold text-2xl hidden md:block whitespace-nowrap">
          Remember This
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {!!user && (
          <Button
            variant="secondary"
            onClick={uploadFile}
            className="whitespace-nowrap"
          >
            Upload Images
          </Button>
        )}
        {!user ? <SignIn /> : <SignOut />}
      </div>
    </header>
  );
};

export default Header;
