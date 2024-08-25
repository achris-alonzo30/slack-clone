"use client";

import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export default function WorkspaceIdPage() {
    const workspaceId = useWorkspaceId();
    return (
        <div>
            <h1>Workspace</h1>
        </div>
    );
}