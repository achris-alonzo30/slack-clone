"use client";

import { useChannelId } from "@/hooks/useChannelId";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { useGetChannelById } from "@/features/channels/api/useGetChannelById";

import { Loader2, TriangleAlert } from "lucide-react";

import { Header } from "./Header";
import { ChatInput } from "./ChatInput";
import { MessageList } from "@/components/MessageList";


export default function ChannelPage() {
    const channelId = useChannelId();

    const { channel, isLoading } = useGetChannelById({ channelId });
    const { results, status, loadMore } = useGetMessages({ channelId });

    if (isLoading || status === "LoadingFirstPage") {
        return (
            <main className="h-full flex-1 flex items-center justify-center">
                <Loader2 className="size-8 text-neutral-500 animate-spin" />
            </main>
        )
    };

    if (!channel) {
        return (
            <main className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
                <TriangleAlert className="size-8 text-rose-500" />
                <span className="text-neutral-500 text-sm font-medium">Channel not found</span>
            </main>
        )
    };

    return (
        <main className="flex flex-col h-full">
            <Header channelName={channel.name} />
            <MessageList 
                data={results}
                loadMore={loadMore}
                channelName={channel.name}
                canLoadMore={status === "CanLoadMore"}
                isLoadingMore={status === "LoadingMore"}
                channelCreationTime={channel._creationTime}
            />
            <ChatInput placeholder="Send a message" />
        </main>
    )
}