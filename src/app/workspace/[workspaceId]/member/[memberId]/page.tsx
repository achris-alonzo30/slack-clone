"use client";

import { useMemberId } from "@/hooks/useMemberId";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export default function MemberPage() {
    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();
    
    return (
        <></>
    )
}