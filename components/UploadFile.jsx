import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "./ui/use-toast";
import Dropzone from "@/components/Dropzone";
import { Line, Circle } from "rc-progress";

import { useAtom } from "jotai";
import {
  isDialogOpenAtom,
  isProcessingAtom,
  currentlyUploadingFileAtom,
  fileCountAtom,
} from "@/lib/jotai/uploadFileDialog";

import { storage, auth } from "@/lib/firebase/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useUploadFile } from "react-firebase-hooks/storage";
import { useAuthState } from "react-firebase-hooks/auth";

const UploadFile = () => {
  const [isDialogOpen, setIsDialogOpen] = useAtom(isDialogOpenAtom);
  const [isProcessing, setIsProcessing] = useAtom(isProcessingAtom);
  const [currentlyUploadingFile, setCurrentlyUploadingFile] = useAtom(
    currentlyUploadingFileAtom
  );
  const [fileCount, setFileCount] = useAtom(fileCountAtom);
  const [uploadFile, uploading, snapshot, error] = useUploadFile();
  const [user] = useAuthState(auth);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      const upload = async (files) => {
        let images = [];
        const downloadURLPromises = [];

        for (let i = 0; i < files.length; i++) {
          const imageId = crypto.randomUUID();
          const result = await uploadFile(
            ref(storage, `${user.uid}/userID_${user.uid}_${imageId}`),
            files[i],
            {
              contentType: "image/jpeg",
            }
          );
          setCurrentlyUploadingFile(i + 1);

          const downloadUrlPromise = getDownloadURL(
            ref(storage, `${user.uid}/userID_${user.uid}_${imageId}`)
          ).then((url) => {
            images.push({
              id: imageId,
              link: url,
              timeCreated: result.metadata.timeCreated,
            });
          });
          downloadURLPromises.push(downloadUrlPromise);
        }

        // Wait for all downloadURLPromises to resolve and process images
        await Promise.all(downloadURLPromises);

        console.log(images);

        // Processing finished, wrap upload up
        toast({
          title: "Success!",
          description: "Files uploaded!",
        });
        setIsProcessing(false);
        setFileCount(0);
        setCurrentlyUploadingFile(0);
      };

      // Check if there are any file rejections
      if (fileRejections.length > 0) {
        toast({
          variant: "destructive",
          title: "Error!",
          description:
            "Only .png and .jpeg files are accepted! Please try again!",
        });
      } else {
        // All files are accepted, process them
        setIsProcessing(true);
        setFileCount(acceptedFiles.length);
        upload(acceptedFiles);
      }
    },
    [
      toast,
      uploadFile,
      setIsProcessing,
      setCurrentlyUploadingFile,
      setFileCount,
      user,
    ]
  );

  const percent = (currentlyUploadingFile / fileCount) * 100;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image(s)</DialogTitle>
        </DialogHeader>
        {!isProcessing && <Dropzone uploadFile={uploadFile} onDrop={onDrop} />}
        {isProcessing && (
          <div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-600">Uploading...</span>
              <span className="text-sm">
                {currentlyUploadingFile} of {fileCount}
              </span>
            </div>
            <Line percent={percent} strokeWidth={4} strokeColor="#bfdbfe" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadFile;
