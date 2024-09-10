import { usePaginatedQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const BATCH_SIZE = 20;

interface UseGetMessagesProps {
    channelId?: Id<"channels">
    parentMessageId?: Id<"messages">
    conversationId?: Id<"conversations">
}

export type GetMessagesReturnType = typeof api.messages.get._returnType["page"];

export const useGetMessages = ({
    channelId,
    conversationId,
    parentMessageId,
} : UseGetMessagesProps) => {
    const { results, status, loadMore } = usePaginatedQuery(api.messages.get, {
        channelId,
        conversationId,
        parentMessageId,
    }, {
        initialNumItems: BATCH_SIZE,
    });

    return {
        status,
        results,
        loadMore: () => loadMore(BATCH_SIZE),
    }
}