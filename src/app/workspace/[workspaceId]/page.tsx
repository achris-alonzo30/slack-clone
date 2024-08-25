"use client";

import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export default function WorkspaceIdPage() {
    const workspaceId = useWorkspaceId();
    const { workspace, isLoading } = useGetWorkspaceById({ workspaceId });
    return (
        <div>
            <h1>Workspace</h1>
        </div>
    );
}