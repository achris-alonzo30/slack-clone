import { useProfileMemberId } from "@/features/members/store/useProfileMemberId";
import { useParentMessageId } from "@/features/messages/store/useParentMessageId";

export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId();
    const [profileMemberId, setProfileMemberId] = useProfileMemberId();

    const onOpenProfile = (memberId: string) => {
        setProfileMemberId(memberId);
        setParentMessageId(null);
    }

    const onOpenMessage = (messageId: string) => {
        setParentMessageId(messageId);
        setProfileMemberId(null);
    }

    const onClose = () => {
        setParentMessageId(null);
        setProfileMemberId(null);
    };

    return {
        onClose,
        onOpenMessage,
        onOpenProfile,
        parentMessageId,
        profileMemberId,
    }
}