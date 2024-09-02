import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useNewJoinCode } from "@/features/workspaces/api/useNewJoinCode";

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
import { Copy, RefreshCcw } from "lucide-react";
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
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure you want to generate a new code?",
        "This will invalidate the current code and all sessions using it."
    );

    const { mutate, isPending } = useNewJoinCode();

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => toast.success("Invite link copied to clipboard"));
    }

    const handleNewCode = async () => {
        const confirmed = await confirm();

        if (!confirmed) return;

        mutate({ 
            workspaceId 
        }, {
            onSuccess: () => {
                toast.success("New code generated");
            },
            onError: (error) => {
                toast.error("Failed to generate new code");
            }
        });
    }


    
    return (
        <>
            <ConfirmDialog />
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
                    <div className="flex items-center justify-center w-full">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isPending}
                            onClick={handleNewCode}
                        >
                            New Code
                            <RefreshCcw className="size-4 ml-2" />
                        </Button>
                        <DialogClose asChild>
                            <Button
                                size="sm"
                                disabled={isPending}
                            >
                                Close
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}