import React from "react";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase/firebase";
import { useSignOut } from "react-firebase-hooks/auth";

const SignOut = () => {
  const [signOut, loading, error] = useSignOut(auth);

  return (
    <Button onClick={signOut} variant="destructive">
      Sign out
    </Button>
  );
};

export default SignOut;
