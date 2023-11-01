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

import { getEmbedding } from "@/lib/utils/embedding";
import { insertRecord } from "@/lib/utils/pinecone";

import { Progress } from "./ui/progress";

const UploadFile = () => {
  const [isDialogOpen, setIsDialogOpen] = useAtom(isDialogOpenAtom);
  const [processingCount, setProcessingCount] = useAtom(processingCountAtom);
  const [processingAmount, setProcessingAmount] = useAtom(processingAmountAtom);
  const [uploadFile, uploading, snapshot, error] = useUploadFile();
  const [user] = useAuthState(auth);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      // uplads the images to cloud storage
      const uploadImageToCloudStorage = async (file, id) => {
        const storageRef = ref(storage, `${user.uid}/userID_${user.uid}_${id}`);
        const result = await uploadFile(storageRef, file, {
          contentType: "image/jpeg",
        });

        const imageUrl = await getDownloadURL(storageRef);

        return {
          imageUrl,
          timeCreated: result.metadata.timeCreated,
        };
      };

      // uploads the image data to firestore
      const uploadImageDataToFirestore = async (image) => {
        const imageRef = doc(db, "users", user.uid, "images", image.id);
        setDoc(imageRef, { ...image });
      };

      //
      const processImages = async (files) => {
        for (const file of files) {
          const id = crypto.randomUUID();

          let image = { id };

          // upload image to cloud storage, adds imageUrl and timeCreated attributes to "image"
          const { imageUrl, timeCreated } = await uploadImageToCloudStorage(
            file,
            id
          );
          image = { ...image, imageUrl, timeCreated };

          // grabs embedding, add embedding to pineconedb
          const embedding = await getEmbedding({ image: image.imageUrl });

          // creates record object, and sends it to a function where it's upserted
          const record = {
            id: image.id,
            values: embedding,
            metadata: {
              imageUrl: image.imageUrl,
            },
          };

          await insertRecord(user.uid, record);

          // upload image data to cloud firestore
          uploadImageDataToFirestore(image);

          setProcessingCount((prevCount) => prevCount + 1);
        }
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
        let images = await processImages(files);

        // uploadImageDataToFirestore(images);

        // images = await getEmbeddings(images);

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
        {!processingAmount ? <Dropzone onDrop={onDrop} /> : null}
        {processingAmount ? (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Uploading...</span>
              <span className="text-sm">
                {processingCount} of {processingAmount}
              </span>
            </div>
            <Progress value={percent} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default UploadFile;
