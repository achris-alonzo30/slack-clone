import { Message } from "./Message";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { GetMessagesReturnType } from "@/features/messages/api/useGetMessages";
import { ChannelInfo } from "./Channelnfo";

interface MessageListProps {
    memberName?: string;
    memberImage?: string;
    channelName?: string;
    loadMore: () => void;
    canLoadMore: boolean;
    isLoadingMore: boolean;
    channelCreationTime?: number;
    data: GetMessagesReturnType | undefined;
    variant?: "channel" | "thread" | "conversation";
}

const formateDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEEE, MMMM d");
}

const TIME_THRESHOLD = 5;

export const MessageList = ({
    data,
    loadMore,
    memberName,
    memberImage,
    channelName,
    canLoadMore,
    isLoadingMore,
    channelCreationTime,
    variant = "channel",
}: MessageListProps) => {
    const groupedMessages = data?.reduce(
        (groups, message) => {
            const date = new Date(message._creationTime);
            const dateKey = format(date, "yyyy-MM-dd");

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].unshift(message);
            return groups
        },
        {} as Record<string, typeof data>
    )

    return (
        <section className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
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
                                isAuthor={false}
                                isEditing={false}
                                id={message._id}
                                key={message._id}
                                body={message.body}
                                isCompact={isCompact}
                                image={message.image}
                                setEditingId={() => {}}
                                hideThreadButton={false}
                                memberId={message.memberId}
                                updatedAt={message.updatedAt}
                                reactions={message.reactions}
                                authorName={message.user.name}
                                authorImage={message.user.image}    
                                threadImage={message.threadImage}
                                threadCount={message.threadCount}
                                createdAt={message._creationTime}
                                threadTimestamp={message.threadTimestamp}
                            />
                        )
                    })}
                </aside>
            ))}
            {variant === "channel" && channelName && channelCreationTime && (
                <ChannelInfo 
                    name={channelName}
                    creationTime={channelCreationTime}
                />
            )}
        </section>
    )
}