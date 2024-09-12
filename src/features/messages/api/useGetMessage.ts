import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetMessage = ({
    messageId,
} : {
    messageId: Id<"messages">
}) => {
    const message = useQuery(api.messages.getById, { id: messageId });
    const isLoading = message === undefined;

    return { message, isLoading }
}