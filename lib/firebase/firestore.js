import { auth, db } from "@/lib/firebase/firebase";
import { collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

const useUserImages = () => {
  const [user, userLoading, userError] = useAuthState(auth);

  const query = user ? collection(db, "users", user.uid, "images") : null;

  const [value, queryLoading, queryError] = useCollection(query);

  const data = value ? value.docs.map((doc) => doc.data()) : [];
  const loading = userLoading || queryLoading;
  const error = userError || queryError;

  return [data, loading, error];
};

export { useUserImages };
