
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetMember } from "@/features/members/api/useGetMember";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetAllMembers } from "@/features/members/api/useGetAllMembers";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";

import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from "lucide-react";

import { SidebarItem } from "./SidebarItem";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceSection } from "./WorkspaceSection";
import { UserItem } from "./UserItem";



export const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId();

    const { members, isLoading: isLoadingAllMembers } = useGetAllMembers({ workspaceId });
    const { channels, isLoading: isLoadingChannels } = useGetChannels({ workspaceId });
    const { member, isLoading: isLoadingMember } = useGetMember({ workspaceId });
    const { workspace, isLoading: isLoadingWorkspace } = useGetWorkspaceById({ workspaceId });

    if (isLoadingMember || isLoadingWorkspace) {
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
            <div className="flex flex-col px-2 mt-3">
                <SidebarItem
                    id="threads"
                    label="Threads"
                    icon={MessageSquareText}
                />
                <SidebarItem
                    id="drafts"
                    label="Drafts & Sent"
                    icon={SendHorizonal}
                />
            </div>
            <WorkspaceSection
                label="Channels"
                hint="New Channels"
                onNew={() => { }}
            >
                {channels?.map((item) => (
                    <SidebarItem
                        id={item._id}
                        key={item._id}
                        icon={HashIcon}
                        label={item.name}
                    />
                ))}
            </WorkspaceSection>
            <WorkspaceSection
                label="Direct Messages"
                hint="New Direct Messages"
                onNew={() => { }}
            >
               {members?.map((item) => (
                <UserItem
                    id={item._id}
                    key={item._id}
                    label={item.user.name}
                    image={item.user.image}
                />
            ))} 
            </WorkspaceSection>
            
        </aside>
    )
}