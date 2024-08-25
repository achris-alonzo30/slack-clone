import { atom, useAtom } from "jotai";

const createWorkspaceModalAtom = atom(false);

export const useModalState = () => {
    return useAtom(createWorkspaceModalAtom);
};