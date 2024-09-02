import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetWorkspacesInfoById = ({ workspaceId }: { workspaceId: Id<"workspaces"> }) => {
    const workspaces = useQuery(api.workspaces.getInfoById, { workspaceId });
    const isLoading = workspaces === undefined;

    return { workspaces, isLoading };
};