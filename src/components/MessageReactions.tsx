import { Doc, Id } from "../../convex/_generated/dataModel"

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
    return (
        <div>
            
        </div>
    )
}