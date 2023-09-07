import { FcGoogle } from "react-icons/fc";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebase";

const SignInWithGoogleButton = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  return (
    <button
      onClick={signInWithGoogle}
      className="flex gap-2 rounded-sm items-center bg-blue-600 hover:bg-blue-700 text-white font-bold p-0.5 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
    >
      <div className="p-2 bg-white">
        <FcGoogle size={20} />
      </div>
      <span className="mr-2 text-sm">Sign in with Google</span>
    </button>
  );
};

export default SignInWithGoogleButton;
