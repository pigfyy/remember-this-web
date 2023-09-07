import { atom } from "jotai";

const isDialogOpenAtom = atom(false);
const isProcessingAtom = atom(false);
const currentlyUploadingFileAtom = atom(0);
const fileCountAtom = atom(0);

export {
  isDialogOpenAtom,
  isProcessingAtom,
  currentlyUploadingFileAtom,
  fileCountAtom,
};
