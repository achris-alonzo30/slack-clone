"use client";

import { useEffect, useState } from "react";
import { useMemberId } from "@/hooks/useMemberId";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useCreateOrGetConversation } from "@/features/conversations/api/useCreateOrGetConversation";

import { Loader2, TriangleAlert } from "lucide-react";

import { toast } from "sonner";
import { MemberConversation } from "./MemberConversation";


export default function MemberPage() {
    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();

    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

    const { mutate, isPending } = useCreateOrGetConversation();

    useEffect(() => {
        mutate({
            memberId,
            workspaceId
        }, {
            onSuccess(data) {
                setConversationId(data);
            },
            onError(error) {
                toast.error("Failed to create conversation");
            }
        })
    }, [memberId, workspaceId, mutate]);

    if (isPending) {
        return (
            <main className="h-full flex items-center justify-center">
                <div className="loader"></div>
            </main>
        )
    }

    if (!conversationId) {
        return (
            <main className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
                <TriangleAlert className="size-8 text-rose-500" />
                <span className="text-neutral-500 text-sm font-medium">Conversation not found</span>
            </main>
        )
    }

    return <MemberConversation conversationId={conversationId} />;
}