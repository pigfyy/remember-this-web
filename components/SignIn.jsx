import { FcGoogle } from "react-icons/fc";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebase";

import {
  doesClassExist,
  createClass,
  deleteAllClasses,
} from "@/lib/utils/weaviate";

const SignInWithGoogleButton = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const signIn = async () => {
    const uid = (await signInWithGoogle())?.user?.uid;

    const isClassExists = await doesClassExist(uid);

    if (isClassExists) return;

    createClass(uid);
  };

  return (
    <button
      onClick={signIn}
      className="flex gap-2 rounded-sm items-center bg-blue-600 hover:bg-blue-700 text-white font-bold p-0.5 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
    >
      <div className="p-2 bg-white">
        <FcGoogle size={20} />
      </div>
      <span className="mr-2 text-sm whitespace-nowrap">
        Sign in with Google
      </span>
    </button>
  );
};

export default SignInWithGoogleButton;
