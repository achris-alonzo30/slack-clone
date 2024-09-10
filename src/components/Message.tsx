import { Doc, Id } from "../../convex/_generated/dataModel";



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
    return (
        <></>
    )
}
