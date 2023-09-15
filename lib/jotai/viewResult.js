import { atom } from "jotai";

const questionAtom = atom("");
const resImgAtom = atom({ blobUrl: "", b64: "" });
const resTextAtom = atom("");

export { questionAtom, resImgAtom, resTextAtom };
