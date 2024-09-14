import { useMemberId } from "@/hooks/useMemberId";
import { Id } from "../../../../../../convex/_generated/dataModel"
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { useGetMemberById } from "@/features/members/api/useGetMemberById";

import { Loader2 } from "lucide-react";

import { Header } from "./Header";
import { ChatInput } from "./ChatInput";


export const MemberConversation = ({
    conversationId
} : {
    conversationId: Id<"conversations">
}) => {
    const memberId = useMemberId();

    const { member, isLoading } = useGetMemberById({ memberId });
    const { results, status, loadMore } = useGetMessages({ conversationId });

    if (isLoading) {
        return (
            <main className="h-full flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </main>
        )
    }
    return (
        <main className="flex flex-col h-full">
            <Header 
                memberName={member?.user.name}  
                memberImage={member?.user.image}
                onClick={() => {}}
            />
            <ChatInput 
                conversationId={conversationId}
                placeholder={`Message ${member?.user.name}`}
            />
        </main>
    )
}