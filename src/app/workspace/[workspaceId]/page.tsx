"use client";

import { useMemo, useEffect} from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";
import { useChannelModalState } from "@/features/channels/store/useChannelModalState";
import { Loader2, TriangleAlert } from "lucide-react";


export default function WorkspaceIdPage() {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useChannelModalState();
    
    const { workspace, isLoading: workspaceLoading } = useGetWorkspaceById({ workspaceId });
    const { channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });

    const channelId = useMemo(() => channels?.[0]?._id, [channels]);

    useEffect(() => {
        if (workspaceLoading || channelsLoading || !workspace) return;

        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open) {
            setOpen(true);
        }
    }, [
        open,
        setOpen,
        router,
        channelId,
        workspace,
        workspaceId,
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

    return null;
}

