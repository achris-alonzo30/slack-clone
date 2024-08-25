import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceByIdProps {
    workspaceId: Id<"workspaces">;
}

export const useGetWorkspaceById = ({ workspaceId }: UseGetWorkspaceByIdProps) => {
    const workspace = useQuery(api.workspaces.getById, {workspaceId});
    const isLoading = workspace === undefined;

    return { workspace, isLoading };
};