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

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

import { client } from "@/lib/utils/weaviate";

const UploadFile = () => {
  const [isDialogOpen, setIsDialogOpen] = useAtom(isDialogOpenAtom);
  const [processingCount, setProcessingCount] = useAtom(processingCountAtom);
  const [processingAmount, setProcessingAmount] = useAtom(processingAmountAtom);
  const [uploadFile, uploading, snapshot, error] = useUploadFile();
  const [user] = useAuthState(auth);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      const uploadToCloudStorage = async (files) => {
        const res = [];
        const downloadURLPromises = [];

        for (const file of files) {
          const imageId = crypto.randomUUID();
          const storageRef = ref(
            storage,
            `${user.uid}/userID_${user.uid}_${imageId}`
          );

          // Upload the file
          const result = await uploadFile(storageRef, file, {
            contentType: "image/jpeg",
          });
          setProcessingCount((prevCount) => prevCount + 1);

          // Get download URL
          const downloadUrlPromise = getDownloadURL(storageRef).then((url) => {
            res.push({
              id: imageId,
              link: url,
              timeCreated: result.metadata.timeCreated,
            });
          });
          downloadURLPromises.push(downloadUrlPromise);
        }

        await Promise.all(downloadURLPromises);
        return res;
      };

      const urlToBase64Blob = async (imageUrl) => {
        try {
          // Fetch the image using the URL
          const response = await fetch(imageUrl);

          if (!response.ok) {
            throw new Error("Failed to fetch the image");
          }

          // Read the response as a blob
          const blob = await response.blob();

          // Create a FileReader to read the blob as base64
          const reader = new FileReader();

          return new Promise((resolve, reject) => {
            reader.onloadend = () => {
              // The result contains the base64-encoded data
              const base64data = reader.result.split(",")[1];
              resolve(base64data);
            };

            // Read the blob as base64
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Error:", error);
          throw error;
        }
      };

      const vectorizeImages = async (images) => {
        images.forEach(async (image) => {
          const base64blob = await urlToBase64Blob(image.link);

          await client.data
            .creator()
            .withClassName(user.uid)
            .withProperties({
              image: base64blob,
            })
            .withId(image.id)
            .do();
        });
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
        const images = await uploadToCloudStorage(files);

        await vectorizeImages(images);

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
    [
      toast,
      uploadFile,
      setProcessingCount,
      setProcessingAmount,
      setIsDialogOpen,
      user,
    ]
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
