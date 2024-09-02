import { atom, useAtom } from "jotai";

const createChannelModalAtom = atom(false);

export const useChannelModalState = () => {
    return useAtom(createChannelModalAtom);
};