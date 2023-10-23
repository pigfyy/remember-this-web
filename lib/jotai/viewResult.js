import { atom } from "jotai";

const isLoadingAtom = atom(false);
const questionAtom = atom("");
const resImgAtom = atom({ blobUrl: "", b64: "" });
const resTextAtom = atom("");

export { isLoadingAtom, questionAtom, resImgAtom, resTextAtom };
