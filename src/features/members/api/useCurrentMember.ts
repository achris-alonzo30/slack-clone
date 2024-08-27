import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel";



export const useCurrentMember = ({
    workspaceId,
} : {
    workspaceId: Id<"workspaces">
}) => {
    const member = useQuery(api.members.get, { workspaceId });
    const isLoading = member === undefined;

    return { member, isLoading }
}