import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel";



export const useGetMemberById = ({
    memberId,
} : {
    memberId: Id<"members">
}) => {
    const member = useQuery(api.members.getById, { memberId });
    const isLoading = member === undefined;

    return { member, isLoading }
}