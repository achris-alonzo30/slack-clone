import {
    format,
    isToday,
    isYesterday
} from "date-fns";
import { toast } from "sonner";
import { Hints } from "../Hints";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useConfirm } from "@/hooks/useConfirm";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { useDeleteMessage } from "@/features/messages/api/useDeleteMessage";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";

import { MessageToolbar } from "@/components/message/MessageToolbar";
import { MessageThumbnail } from "@/components/message/MessageThumbnail";
import { MessageReactions } from "@/components/message/MessageReactions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToggleReaction } from "@/features/reactions/api/useToggleReaction";



const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
const Renderer = dynamic(() => import("@/components/Renderer"), { ssr: false });

interface MessageProps {
    body: string;
    isAuthor: boolean;
    isEditing: boolean;
    isCompact?: boolean;
    authorName?: string;
    authorImage?: string;
    threadImage?: string;
    threadCount?: number;
    threadTimestamp?: number;
    hideThreadButton?: boolean;
    image: string | null | undefined;

    id: Id<"messages">;
    key: Id<"messages">;
    memberId: Id<"members">;
    updatedAt: Doc<"messages">["updatedAt"];
    reactions: Array<Omit<Doc<"reactions">, "memberId"> & {
        count: number;
        memberIds: Id<"members">[];
    }>;
    createdAt: Doc<"messages">["_creationTime"];
    setEditingId: (id: Id<"messages"> | null) => void;
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "H:mm:ss a")}`;
}

export const Message = ({
    id,
    body,
    image,
    memberId,
    isAuthor,
    isEditing,
    isCompact,
    updatedAt,
    reactions,
    createdAt,
    authorImage,
    threadImage,
    threadCount,
    setEditingId,
    threadTimestamp,
    hideThreadButton,
    authorName = "Member",
}: MessageProps) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete message",
        "Are you sure you want to delete this message?"
    );

    const { mutate: updateMessage, isPending: isPendingMessage } = useUpdateMessage();
    const { mutate: deleteMessage, isPending: isDeletingMessage } = useDeleteMessage();
    const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction();

    const isPending = isPendingMessage;

    const handleUpdate = ({ body }: { body: string }) => {
        updateMessage({ body, id }, {
            onSuccess: () => {
                toast.success("Message updated successfully");
                setEditingId(null);
            },
            onError: () => {
                toast.error("Failed to update message");
            }
        });
    }

    const handleDelete = async () => {
        const confirmed = await confirm();

        if (!confirmed) return;

        deleteMessage({ id }, {
            onSuccess: () => {
                toast.success("Message deleted successfully");
            },
            onError: () => {
                toast.error("Failed to delete message");
            }
        })
    }

    const handleToggleReaction = (value: string) => {
        toggleReaction({ value, messageId: id }, {
            onError: () => {
                toast.error("Failed to add reaction");
            }
        });
    }


    if (isCompact) {
        return (
            <>
                <ConfirmDialog />
                <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-neutral-100/60 group relative",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    isDeletingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                )}>
                    <div className="flex items-start gap-2">
                        <Hints label={formatFullTime(new Date(createdAt))}>
                            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] hover:underline">
                                {format(new Date(createdAt), "HH:mm")}
                            </button>
                        </Hints>
                        {isEditing ? (
                            <div>
                                <Editor
                                    variant="update"
                                    disabled={isPending}
                                    onSubmit={handleUpdate}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setEditingId(null)}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <Renderer value={body} />
                                <MessageThumbnail url={image} />
                                {updatedAt ? (
                                    <span className="text-xs text-muted-foreground">(edited)</span>
                                ) : null}
                                <MessageReactions
                                    data={reactions}
                                    onChange={handleToggleReaction}
                                />
                            </div>
                        )}

                    </div>
                    {
                        !isEditing && (
                            <MessageToolbar
                                isAuthor={isAuthor}
                                isPending={isPending}
                                handleThread={() => { }}
                                handleDelete={handleDelete}
                                handleEdit={() => setEditingId(id)}
                                hideThreadButton={hideThreadButton}
                                handleReaction={handleToggleReaction}
                            />
                        )
                    }
                </div >
            </>
        )
    }

    return (
        <>
            <ConfirmDialog />
            <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-neutral-100/60 group relative",
                isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                isDeletingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
            )}>
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar>
                            <AvatarImage className="rounded-md" src={authorImage} />
                            <AvatarFallback className="rounded-md text-sm bg-neutral-900 text-white">
                                {authorName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {isEditing ? (
                        <div className="w-full h-full">
                            <Editor
                                variant="update"
                                disabled={isPending}
                                onSubmit={handleUpdate}
                                defaultValue={JSON.parse(body)}
                                onCancel={() => setEditingId(null)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full overflow-hidden">
                            <div className="text-sm">
                                <button
                                    onClick={() => { }}
                                    className="font-bold text-primary hover:underline"
                                >
                                    {authorName}
                                </button>
                                <span>&nbsp;&nbsp;</span>
                                <Hints label={formatFullTime(new Date(createdAt))}>
                                    <button className="text-xs text-muted-foreground hover:underline">
                                        {format(new Date(createdAt), "ƒh:mm a")}
                                    </button>
                                </Hints>
                            </div>
                            <Renderer value={body} />
                            <MessageThumbnail url={image} />
                            {
                                updatedAt ? (
                                    <span className="text-xs text-muted-foreground">(edited)</span>
                                ) : null
                            }
                            <MessageReactions
                                data={reactions}
                                onChange={handleToggleReaction}
                            />
                        </div >
                    )}
                </div >
                {!isEditing && (
                    <MessageToolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        handleThread={() => { }}
                        handleDelete={handleDelete}
                        handleEdit={() => setEditingId(id)}
                        hideThreadButton={hideThreadButton}
                        handleReaction={handleToggleReaction}
                    />
                )}
            </div >
        </>
    )
}
