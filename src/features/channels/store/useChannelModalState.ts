import { atom, useAtom } from "jotai";

const createChannelModalAtom = atom(false);

export const useModalState = () => {
    return useAtom(createChannelModalAtom);
};