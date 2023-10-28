import { FcGoogle } from "react-icons/fc";

import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebase";

import { listIndexes, createClass } from "@/lib/utils/pinecone";

const SignInWithGoogleButton = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const signIn = async () => {
    const uid = (await signInWithGoogle())?.user?.uid;

    const index = await listIndexes();

    // returns if index list includes an index named with the users id
    for (const i of index) {
      if (i.name == uid.toLowerCase()) return;
    }

    // creates class, and checks for error
    const response = await createClass(uid);
    if (response.status !== 200)
      console.error("Something has gone wrong while creating new index...");
  };

  return (
    <button
      onClick={signIn}
      className="flex gap-2 rounded-sm items-center bg-blue-600 hover:bg-blue-700 text-white font-bold p-0.5 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
    >
      <div className="p-2 bg-white">
        <FcGoogle size={20} />
      </div>
      <span className="mr-2 text-sm whitespace-nowrap hidden md:block">
        Sign in with Google
      </span>
    </button>
  );
};

export default SignInWithGoogleButton;
