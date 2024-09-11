import { useParentMessageId } from "@/features/messages/store/useParentMessageId";

export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId();

    const onOpenMessage = (messageId: string) => {
        setParentMessageId(messageId);
    }

    const onClose = () => {
        setParentMessageId(null);
    };

    return {
        onClose,
        onOpenMessage,
        parentMessageId,
    }
}