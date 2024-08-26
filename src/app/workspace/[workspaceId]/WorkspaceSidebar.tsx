
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";
import { AlertTriangle, Loader } from "lucide-react";

export const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId();
    const { members, isLoading: isLoadingMembers } = useCurrentMember({ workspaceId });
    const { workspace, isLoading: isLoadingWorkspace } = useGetWorkspaceById({ workspaceId });

    if (isLoadingMembers || isLoadingWorkspace) {
        return (
            <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
                <Loader className="size-5 animate-spin text-white" />
            </div>
        )
    }

    if (!workspace || !members) {
        return (
            <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
                <AlertTriangle className="size-5 text-white" />
                <p className="text-neutral-300 text-sm">
                    You are not a member of this workspace
                </p>
            </div>
        )
    }

    return (
        <aside className="flex flex-col bg-[#5e2c5f] h-full">
            <WorkspaceHeader />
        </aside>
    )
}