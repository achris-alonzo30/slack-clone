"use client";

import { useChannelId } from "@/hooks/useChannelId";
import { useGetChannelById } from "@/features/channels/api/useGetChannelById";

import { Loader2, TriangleAlert } from "lucide-react";

import { Header } from "./Header";
import { ChatInput } from "./ChatInput";

export default function ChannelPage() {
    const channelId = useChannelId();

    const { channel, isLoading } = useGetChannelById({ channelId });

    if (isLoading) {
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
            <div className="flex-1" />
            <ChatInput />
        </main>
    )
}