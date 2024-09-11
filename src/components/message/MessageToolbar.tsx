import { EmojiPopover } from "../EmojiPopover";
import { Hints } from "../Hints";
import { Button } from "../ui/button";
import { MessageSquare, Pencil, Smile, Trash } from "lucide-react";

interface MessageToolbarProps {
    isAuthor: boolean;
    isPending: boolean
    handleEdit: () => void;
    handleThread: () => void;
    handleDelete: () => void;
    hideThreadButton?: boolean;
    handleReaction: (value: string) => void;
}

export const MessageToolbar = ({
    isAuthor,
    isPending,
    handleEdit,
    handleThread,
    handleDelete,
    handleReaction,
    hideThreadButton,
}: MessageToolbarProps) => {
    return (
        <div className="absolute top-0 right-5 ">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
                <EmojiPopover
                    hint="Add Reaction"
                    onEmojiSelect={(emoji) => handleReaction(emoji.native)}
                >
                    <Button
                        size="iconSm"
                        variant="ghost"
                        disabled={isPending}
                    >
                        <Smile className="size-4" />
                        <span className="sr-only">Add Reaction</span>
                    </Button>
                </EmojiPopover>
                {!hideThreadButton && (
                    <Hints label="Reply in Thread">
                        <Button
                            size="iconSm"
                            variant="ghost"
                            disabled={isPending}
                            onClick={handleThread}
                        >
                            <MessageSquare className="size-4" />
                            <span className="sr-only">Reply in Thread</span>
                        </Button>
                    </Hints>
                )}

                {isAuthor && (
                    <>
                        <Hints label="Edit Message">
                            <Button
                                size="iconSm"
                                variant="ghost"
                                disabled={isPending}
                                onClick={handleEdit}
                            >
                                <Pencil className="size-4" />
                                <span className="sr-only">Edit Message</span>
                            </Button>
                        </Hints>
                        <Hints label="Delete Message">
                            <Button
                                size="iconSm"
                                variant="ghost"
                                disabled={isPending}
                                onClick={handleDelete}
                            >
                                <Trash className="size-4" />
                                <span className="sr-only">Delete Message</span>
                            </Button>
                        </Hints>
                    </>
                )}
            </div>
        </div>
    )
}