import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetChannelByIdProps {
    channelId: Id<"channels">;
}

export const useGetChannelById = ({ channelId }: UseGetChannelByIdProps) => {
    const channel = useQuery(api.channels.getById, { channelId });
    const isLoading = channel === undefined;

    return { channel, isLoading };
}