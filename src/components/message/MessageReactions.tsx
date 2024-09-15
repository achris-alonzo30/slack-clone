import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Doc, Id } from "../../../convex/_generated/dataModel"
import { useGetMember } from "@/features/members/api/useGetMember";
import { Hints } from "../Hints";
import { EmojiPopover } from "../EmojiPopover";
import { MdOutlineAddReaction } from "react-icons/md";

interface MessageReactionsProps {
    onChange: (value: string) => void;
    data: Array<Omit<Doc<"reactions">, "memberId"> & {
        count: number;
        memberIds: Id<"members">[];
    }>;
}

export const MessageReactions = ({
    data,
    onChange
} : MessageReactionsProps) => {
    const workspaceId = useWorkspaceId();
    const { member } = useGetMember({ workspaceId });

    const currentMemberId = member?._id;

    if (data.length === 0 || !currentMemberId) return null;

    return (
        <div className="flex items-center gap-1 my-1">
            {data.map((reaction) => (
                <Hints key={reaction._id} label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}>
                <button
                    onClick={() => onChange(reaction.value)}
                    className={cn("h-6 px-2 rounded-full bg-neutral-200/70 border border-transparent text-neutral-800 flex items-center gap-x-1",
                        reaction.memberIds.includes(currentMemberId) && "bg-sky-100/70 border-sky-500 text-white"
                    )}
                >
                    {reaction.value}
                    <span className={cn("text-xs font-semibold text-muted-foreground",
                        reaction.memberIds.includes(currentMemberId) && "text-sky-500"
                    )}>{reaction.count}</span>
                    <span className="sr-only">Add Reaction</span>
                </button>
                </Hints>
            ))}
            <EmojiPopover
                hint="Add Reaction"
                onEmojiSelect={(emoji) => onChange(emoji)}
            >
                <button
                    className="h-7 px-3 rounded-full bg-neutral-200/70 border border-transparent hover:border-neutral-500 text-neutral-800 flex items-center gap-x-1"
                >
                    <MdOutlineAddReaction className="size-4" />
                </button>
            </EmojiPopover>
        </div>
    )
}