import { atom } from "jotai";

const isDialogOpenAtom = atom(false);
const processingCountAtom = atom(0);
const processingAmountAtom = atom(0);

export { isDialogOpenAtom, processingCountAtom, processingAmountAtom };
