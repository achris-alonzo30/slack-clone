import Quill from "quill";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useChannelId } from "@/hooks/useChannelId";
import { useGetMessage } from "../api/useGetMessage";
import { differenceInMinutes, format } from "date-fns";
import { useGetMessages } from "../api/useGetMessages";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useCreateMessage } from "../api/useCreateMessage";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/useGetMember";
import { useGenerateUploadURL } from "@/features/upload/api/useGenerateUploadURL";

import {
    X,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/message/Message";

const TIME_THRESHOLD = 5;

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

type CreateMessageValues = {
    body: string;
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    parentMessageId: Id<"messages">;
    image: Id<"_storage"> | undefined;
}

export const MessageThread = ({
    onClose,
    messageId,
}: {
    onClose: () => void;
    messageId: Id<"messages">;
}) => {
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();

    const { member } = useGetMember({ workspaceId });
    const { message, isLoading } = useGetMessage({ messageId });
    const { results, status, loadMore } = useGetMessages({
        channelId,
        parentMessageId: messageId,
    });

    const editorRef = useRef<Quill | null>(null);

    const [editorKey, setEditoryKey] = useState(0);
    const [isPending, setIsPending] = useState(false);
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

    const { mutate: createMessage } = useCreateMessage();
    const { mutate: generateUploadURL } = useGenerateUploadURL();

    const canLoadMore = status === "CanLoadMore";
    const isLoadingMore = status === "LoadingMore";

    const handleSubmit = async ({
        body,
        image
    }: {
        body: string;
        image: File | null;
    }) => {
        try {
            setIsPending(true);
            editorRef?.current?.enable(false);

            const values: CreateMessageValues = {
                body,
                channelId,
                workspaceId,
                image: undefined,
                parentMessageId: messageId,
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
            editorRef?.current?.enable(true);
        }
    }

    const groupedMessages = results?.reduce(
        (groups, message) => {
            const date = new Date(message._creationTime);
            const dateKey = format(date, "yyyy-MM-dd");

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].unshift(message);
            return groups
        },
        {} as Record<string, typeof results>
    )

    if (isLoading || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button
                        size="iconSm"
                        variant="ghost"
                        onClick={onClose}
                    >
                        <X className="size-5 stroke-[1.5" />
                        <span className="sr-only">Close Thread Panel</span>
                    </Button>
                </div>
                <div className="h-full flex items-center justify-center">
                    <div className="loader"></div>
                </div>
            </div>
        )
    };

    if (!message) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button
                        size="iconSm"
                        variant="ghost"
                        onClick={onClose}
                    >
                        <X className="size-5 stroke-[1.5" />
                        <span className="sr-only">Close Thread Panel</span>
                    </Button>
                </div>
                <div className="h-full flex flex-col gap-y-2 items-center justify-center">
                    <AlertTriangle className="size-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Message not found</p>
                </div>
            </div>
        )
    }

    function formateDateLabel(dateKey: string): import("react").ReactNode {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center h-[49px] px-4 border-b">
                <p className="text-lg font-bold">Thread</p>
                <Button
                    size="iconSm"
                    variant="ghost"
                    onClick={onClose}
                >
                    <X className="size-5 stroke-[1.5" />
                    <span className="sr-only">Close Thread Panel</span>
                </Button>
            </div>
            <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
                {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
                    <aside key={dateKey}>
                        <div className="text-center my-2 relative">
                            <hr className="absolute top-1/2 left-0 right-0 border-t border-neutral-300" />
                            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-neutral-300 shadow-sm">
                                {formateDateLabel(dateKey)}
                            </span>
                        </div>
                        {messages.map((message, index) => {
                            const prevMessage = messages[index - 1];

                            const isCompact =
                                prevMessage &&
                                prevMessage.user?._id === message.user?._id &&
                                differenceInMinutes(
                                    new Date(message._creationTime),
                                    new Date(prevMessage._creationTime)
                                ) < TIME_THRESHOLD;

                            return (
                                <Message
                                    hideThreadButton
                                    id={message._id}
                                    key={message._id}
                                    body={message.body}
                                    isCompact={isCompact}
                                    image={message.image}
                                    setEditingId={setEditingId}
                                    memberId={message.memberId}
                                    updatedAt={message.updatedAt}
                                    reactions={message.reactions}
                                    authorName={message.user.name}
                                    threadName={message.threadName}
                                    authorImage={message.user.image}
                                    threadImage={message.threadImage}
                                    threadCount={message.threadCount}
                                    createdAt={message._creationTime}
                                    isEditing={editingId === message._id}
                                    threadTimestamp={message.threadTimestamp}
                                    isAuthor={message.memberId === member?._id}
                                />
                            )
                        })}
                    </aside>
                ))}
                <div
                    className="h-1"
                    ref={(el) => {
                        const observer = new IntersectionObserver(
                            ([entry]) => {
                                if (entry.isIntersecting && canLoadMore) {
                                    loadMore();
                                }
                            },
                            { threshold: 1.0 }
                        );

                        observer.observe(el as Element);
                        return () => observer.disconnect();
                    }}
                />
                {isLoadingMore && (
                    <div className="text-center my-2 relative">
                        <hr className="absolute top-1/2 left-0 right-0 border-t border-neutral-300" />
                        <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-neutral-300 shadow-sm">
                            <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        </span>
                    </div>
                )}
                <Message
                    hideThreadButton
                    id={message._id}
                    key={message._id}
                    body={message.body}
                    isCompact={false}
                    image={message.image}
                    setEditingId={setEditingId}
                    memberId={message.memberId}
                    updatedAt={message.updatedAt}
                    reactions={message.reactions}
                    authorName={message.user.name}
                    authorImage={message.user.image}
                    createdAt={message._creationTime}
                    isEditing={editingId === message._id}
                    isAuthor={message.memberId === member?._id}
                />
            </div>
            <div className="px-4">
                <Editor
                    key={editorKey}
                    disabled={isPending}
                    innerRef={editorRef}
                    onSubmit={handleSubmit}
                    placeholder="Reply to this message..."
                />
            </div>
        </div>
    )
}