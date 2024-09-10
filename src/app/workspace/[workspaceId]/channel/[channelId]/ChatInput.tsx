import Quill from "quill";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useChannelId } from "@/hooks/useChannelId";


const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

export const ChatInput = ({
    placeholder
} : {
    placeholder: string;
}) => {
    const innerRef = useRef<Quill | null>(null);
    const { mutate } = useCreateMessage();

    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const handleSubmit = ({
        body,
        image
    }: {
        body: string;   
        image: File | null;
    }) => {
        mutate({
            body,
            channelId,
            workspaceId
        })
    }
    
    return (
        <div className="px-5 w-full">
            <Editor 
                disabled={false}
                innerRef={innerRef}
                onSubmit={handleSubmit}
                placeholder={placeholder}
            />
        </div>
    )
}