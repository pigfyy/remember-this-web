import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

import { auth } from "@/lib/firebase/firebase";
import { useSignOut } from "react-firebase-hooks/auth";

const SignOut = () => {
  const [signOut, loading, error] = useSignOut(auth);

  return (
    <Button
      onClick={signOut}
      variant="destructive"
      className="whitespace-nowrap"
    >
      <span className="hidden md:block">Sign Out</span>
      <LogOut className="md:hidden" />
    </Button>
  );
};

export default SignOut;
