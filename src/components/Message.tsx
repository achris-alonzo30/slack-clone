import {
    format,
    isToday,
    isYesterday
} from "date-fns";
import { toast } from "sonner";
import { Hints } from "./Hints";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";

import { MessageToolbar } from "./MessageToolbar";
import { MessageThumbnail } from "./MessageThumbnail";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
    const { mutate, isPending: isPendingMessage } = useUpdateMessage();

    const isPending = isPendingMessage;

    const handleUpdate = ({ body }: { body: string }) => {
        mutate({ body, id }, {
            onSuccess: () => {
                toast.success("Message updated successfully");
                setEditingId(null);
            },
            onError: () => {
                toast.error("Failed to update message");
            }
        });
    }


    if (isCompact) {
        return (
            <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-neutral-100/60 group relative",
                isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]"
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
                        </div>
                    )}

                </div>
                {
                    !isEditing && (
                        <MessageToolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setEditingId(id)}
                            handleThread={() => { }}
                            handleDelete={() => { }}
                            handleReaction={() => { }}
                            hideThreadButton={hideThreadButton}
                        />
                    )
                }
            </div >
        )
    }

    return (
        <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-neutral-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]"
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
                    </div >
                )}
            </div >
            {!isEditing && (
                <MessageToolbar
                    isAuthor={isAuthor}
                    isPending={isPending}
                    handleEdit={() => setEditingId(id)}
                    handleThread={() => { }}
                    handleDelete={() => { }}
                    handleReaction={() => { }}
                    hideThreadButton={hideThreadButton}
                />
            )}
        </div >
    )
}
