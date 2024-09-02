import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

import {
    Dialog,
    DialogClose,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogContent,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InviteModalProps {
    isOpen: boolean;
    name: string;
    joinCode: string;
    setIsOpen: (isOpen: boolean) => void;
}

export const InviteModal = ({
    isOpen,
    setIsOpen,
    name,
    joinCode,
}: InviteModalProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => toast.success("Invite link copied to clipboard"));
    }

    
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="p-0 bg-neutral-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>Invite People to {name}</DialogTitle>
                        <DialogDescription>
                            Share the code below with your friends to join this workspace.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                        <p className="text-4xl font-semibold tracking-widest uppercase">
                            {joinCode}
                        </p>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCopy}
                        >
                            Copy
                            <Copy className="size-4 ml-2" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}