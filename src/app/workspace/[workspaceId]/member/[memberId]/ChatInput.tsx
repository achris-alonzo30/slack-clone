import Quill from "quill";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";


import { toast } from "sonner";
import { useGenerateUploadURL } from "@/features/upload/api/useGenerateUploadURL";



const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

type CreateMessageValues = {
    body: string;
    workspaceId: Id<"workspaces">;
    image: Id<"_storage"> | undefined;
    conversationId: Id<"conversations">;
}

export const ChatInput = ({
    placeholder,
    conversationId
}: {
    placeholder: string;
    conversationId: Id<"conversations">;
}) => {
    const [editorKey, setEditoryKey] = useState(0);
    const [isPending, setIsPending] = useState(false);

    const innerRef = useRef<Quill | null>(null);

    const workspaceId = useWorkspaceId();

    const { mutate: createMessage } = useCreateMessage();
    const { mutate: generateUploadURL } = useGenerateUploadURL();

    const handleSubmit = async ({
        body,
        image
    }: {
        body: string;
        image: File | null;
    }) => {
        try {
            setIsPending(true);
            innerRef?.current?.enable(false);

            const values: CreateMessageValues = {
                body,
                workspaceId,
                conversationId,
                image: undefined
            }

            if (image) {
                const url = await generateUploadURL({}, {
                    throwError: true
                });

                if (!url) throw new Error("Failed to generate upload URL");

                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": image.type
                    },
                    body: image
                });

                if (!res.ok) throw new Error("Failed to upload image");

                const { storageId } = await res.json();

                values.image = storageId;
            }

            await createMessage(values, { throwError: true });
            // Clear the after submitting the message
            setEditoryKey((prevKey) => prevKey + 1)
        } catch (error) {
            console.log(error);
            toast.error("Failed to send message");
        } finally {
            setIsPending(false);
            innerRef?.current?.enable(true);
        }
    }

    return (
        <div className="px-5 w-full">
            <Editor
                key={editorKey}
                innerRef={innerRef}
                disabled={isPending}
                onSubmit={handleSubmit}
                placeholder={placeholder}
            />
        </div>
    )
}