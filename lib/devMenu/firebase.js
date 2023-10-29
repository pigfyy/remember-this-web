import { getStorage, ref, deleteObject } from "firebase/storage";
import { storage, db, auth } from "@/lib/firebase/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export const getUserImageDocs = async () => {
  const uid = auth.currentUser.uid;

  const result = [];
  const querySnapshot = await getDocs(collection(db, "users", uid, "images"));

  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });

  return result;
};

export const deleteUserImageDoc = async (docId) => {
  const uid = auth.currentUser.uid;
  await deleteDoc(doc(db, "users", uid, "images", docId));
};

export const deleteUserImage = async (imageId) => {
  const uid = auth.currentUser.uid;
  const storageRef = ref(storage, `${uid}/userID_${uid}_${imageId}`);

  await deleteObject(storageRef);
};
