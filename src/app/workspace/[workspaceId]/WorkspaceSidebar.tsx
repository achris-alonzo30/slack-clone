
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";

import { AlertTriangle, Loader, MessageSquareText } from "lucide-react";

import { WorkspaceHeader } from "./WorkspaceHeader";
import { SidebarItem } from "./SidebarItem";

export const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId();
    const { member, isLoading: isLoadingMembers } = useCurrentMember({ workspaceId });
    const { workspace, isLoading: isLoadingWorkspace } = useGetWorkspaceById({ workspaceId });

    if (isLoadingMembers || isLoadingWorkspace) {
        return (
            <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
                <Loader className="size-5 animate-spin text-white" />
            </div>
        )
    }

    if (!workspace || !member) {
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
            <WorkspaceHeader workspace={workspace} isAdmin={member!.role === "admin"} />
            <div className="flex flex-cil px-2 mt-3">
                <SidebarItem
                    id="threads"
                    label="Threads"
                    icon={MessageSquareText}
                />
            </div>
        </aside>
    )
}