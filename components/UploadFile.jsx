import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "./ui/use-toast";
import Dropzone from "@/components/Dropzone";
import { Line } from "rc-progress";

import { useAtom } from "jotai";
import {
  isDialogOpenAtom,
  processingCountAtom,
  processingAmountAtom,
} from "@/lib/jotai/uploadFileDialog";

import { storage, auth } from "@/lib/firebase/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";
import { useAuthState } from "react-firebase-hooks/auth";

import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

import { client } from "@/lib/utils/weaviate";

import { fileToBase64BlobString, b64ToBlobUrl } from "@/lib/utils/processing";

const UploadFile = () => {
  const [isDialogOpen, setIsDialogOpen] = useAtom(isDialogOpenAtom);
  const [processingCount, setProcessingCount] = useAtom(processingCountAtom);
  const [processingAmount, setProcessingAmount] = useAtom(processingAmountAtom);
  const [user] = useAuthState(auth);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      const vectorizeImages = async (files) => {
        const imagePromises = [];

        for (const file of files) {
          const id = crypto.randomUUID();
          const b64BlobString = (await fileToBase64BlobString(file)).split(
            ","
          )[1];

          const imagePromise = client.data
            .creator()
            .withClassName(user.uid)
            .withProperties({
              image: b64BlobString,
            })
            .withId(id)
            .do()
            .then(() => {
              const link = b64ToBlobUrl(b64BlobString);
              const timeCreated = Timestamp.now();
              return { id, link, timeCreated };
            });

          imagePromises.push(imagePromise);
        }
        const images = await Promise.all(imagePromises);

        return images;
      };

      const uploadImageDataToFirestore = (images) => {
        images.forEach((image) => {
          const imageRef = doc(db, "users", user.uid, "images", image.id);
          setDoc(imageRef, { ...image });
        });
      };

      const handleUploadSuccess = () => {
        toast({
          title: "Success!",
          description: "Images uploaded!",
        });
        setProcessingAmount(0);
        setProcessingCount(0);
        setIsDialogOpen(false);
      };

      const uploadImages = async (files) => {
        const images = await vectorizeImages(files);

        uploadImageDataToFirestore(images);

        handleUploadSuccess();
      };

      // Check if there are any file rejections
      if (fileRejections.length > 0) {
        toast({
          variant: "destructive",
          title: "Error!",
          description:
            "Only .png and .jpeg images are accepted! Please try again!",
        });
      } else {
        // All files are accepted, process them
        setProcessingAmount(acceptedFiles.length);
        uploadImages(acceptedFiles);
      }
    },
    [toast, setProcessingCount, setProcessingAmount, setIsDialogOpen, user]
  );

  const percent = (processingCount / processingAmount) * 100;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image(s)</DialogTitle>
        </DialogHeader>
        {!processingAmount && <Dropzone onDrop={onDrop} />}
        {!!(processingAmount && processingAmount !== true) && (
          <div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Uploading...</span>
              <span className="text-sm">
                {processingCount} of {processingAmount}
              </span>
            </div>
            <Line percent={percent} strokeWidth={4} strokeColor="#bfdbfe" />
          </div>
        )}
        {!!(processingAmount && processingAmount === true) && (
          <span className="text-sm text-neutral-600">Analyzing...</span>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadFile;
