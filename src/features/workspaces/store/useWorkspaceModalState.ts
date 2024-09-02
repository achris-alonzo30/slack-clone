import { atom, useAtom } from "jotai";

const createWorkspaceModalAtom = atom(false);

export const useWorkspaceModalState = () => {
    return useAtom(createWorkspaceModalAtom);
};