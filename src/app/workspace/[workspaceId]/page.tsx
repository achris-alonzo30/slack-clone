"use client";

import { useMemo, useEffect} from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";
import { useChannelModalState } from "@/features/channels/store/useChannelModalState";
import { Loader2, TriangleAlert } from "lucide-react";
import { useGetMember } from "@/features/members/api/useGetMember";


export default function WorkspaceIdPage() {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useChannelModalState();
    
    const { member, isLoading: memberLoading } = useGetMember({ workspaceId });
    const { channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
    const { workspace, isLoading: workspaceLoading } = useGetWorkspaceById({ workspaceId });
    

    const channelId = useMemo(() => channels?.[0]?._id, [channels]);
    const isAdmin = useMemo(() => member?.role === "admin", [member]);

    useEffect(() => {
        if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return;

        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open && isAdmin) {
            setOpen(true);
        }
    }, [
        open,
        router,
        member,
        setOpen,
        isAdmin,
        channelId,
        workspace,
        workspaceId,
        memberLoading,
        channelsLoading,
        workspaceLoading,
    ]);

    if (workspaceLoading || channelsLoading) {
        return (
            <main className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <Loader2 className="size-8 animate-spin text-neutral-500" />
            </main>
        )
    };

    if (!workspace) {
        return (
            <main className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <TriangleAlert className="size-8 text-rose-500" />
                <span className="text-neutral-500 text-sm font-medium">Workspace not found</span>
            </main>
        )
    };

    return (
        <main className="h-full flex-1 flex items-center justify-center flex-col gap-2">
            <TriangleAlert className="size-8 text-rose-500" />
            <span className="text-neutral-500 text-sm font-medium">No channels found</span>
        </main>
    );
}

