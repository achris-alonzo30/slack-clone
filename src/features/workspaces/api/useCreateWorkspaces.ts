import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useCallback } from "react";

type RequestType = any;
type ResponseType = any;

type Options = {
    onError?: () => void;
    onSuccess?: () => void;
    onSettled?: () => void;
}

export const useCreateWorkspace = () => {
    const create = useMutation(api.workspaces.create);

    const mutate = useCallback( async (values: RequestType, options?: Options) => {
        try {
            const response = await create(values);

            options?.onSuccess?.();
        } catch (error) {
            options?.onError?.();
        } finally {
            options?.onSettled?.();
        }
    }, [create]);

    return { mutate };
}