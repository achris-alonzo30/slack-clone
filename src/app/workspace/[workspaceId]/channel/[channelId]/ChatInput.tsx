import Quill from "quill";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useChannelId } from "@/hooks/useChannelId";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";


import { toast } from "sonner";


const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export const ChatInput = ({
    placeholder
}: {
    placeholder: string;
}) => {
    const [editorKey, setEditoryKey] = useState(0);
    const [isPending, setIsPending] = useState(false);

    const innerRef = useRef<Quill | null>(null);

    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const { mutate } = useCreateMessage();

    const handleSubmit = async ({
        body,
        image
    }: {
        body: string;
        image: File | null;
    }) => {
        try {
            setIsPending(true);
            await mutate({
                body,
                channelId,
                workspaceId
            }, { 
                throwError: true 
            });
            // Clear the after submitting the message
            setEditoryKey((prevKey) => prevKey + 1)
        } catch (error) {
            console.log(error);
            toast.error("Failed to send message");
        } finally {
            setIsPending(false);
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