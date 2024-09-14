import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface MessageThreadBarProps {
    name?: string;
    image?: string;
    count?: number;
    timestamp?: number;
    onClick?: () => void;
}

export const MessageThreadBar = ({
    image,
    count,
    onClick,
    timestamp,
    name = "Anonymous",
}: MessageThreadBarProps) => {
    if (!count || !timestamp) return null;

    return (
        <button
            onClick={onClick}
            className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
        >
            <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="size-6 shrink-0 rounded-md mr-1">
                    <AvatarImage className="object-cover rounded-md" src={image} />
                    <AvatarFallback className="rounded-md text-sm font-medium text-neutral-300 bg-neutral-950">{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-sky-700 hover:underline font-bold truncate">{count} {count > 1 ? "replies" : "reply"}</span>
                <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
                    Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
                </span>
                <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
                    View Thread
                </span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
        </button>
    )
}