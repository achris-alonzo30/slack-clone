import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useUpdateWorkspace } from "@/features/workspaces/api/useUpdateWorkspace";
import { useDeleteWorkspace } from "@/features/workspaces/api/useDeleteWorkspace";

import {
    Dialog,
    DialogClose,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/useConfirm";


interface PreferencesModalProps {
    isOpen: boolean;
    intialValue: string;
    setIsOpen: (isOpen: boolean) => void;

}

export const PreferencesModal = ({
    isOpen,
    setIsOpen,
    intialValue
}: PreferencesModalProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This action cannot be undone."
    );

    const [value, setValue] = useState(intialValue);
    const [editIsOpen, setEditIsOpen] = useState(false);

    const { mutate: updateWorkspace, isPending: isUpdating } = useUpdateWorkspace();
    const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspace();

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateWorkspace({
            workspaceId,
            name: value
        }, {
            onSuccess: () => {
                toast.success("Workspace updated successfully");
                setEditIsOpen(false);
            },
            onError: () => {
                toast.error("Failed to update workspace");
            }
        })
    }

    const handleDelete = async () => {
        const confirmed = await confirm();
        if (!confirmed) return;
        

        deleteWorkspace({ workspaceId }, {
            onSuccess: () => {
                toast.success("Workspace deleted successfully");
                router.replace("/")
                setIsOpen(false);
            },
            onError: () => {
                toast.error("Failed to delete workspace");
            }
        })
    }
    return (
        <>
            <ConfirmDialog />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="p-0 bg-neutral-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>{value}</DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editIsOpen} onOpenChange={setEditIsOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-neutral-50">
                                    <div className="flex ittems-center justify-between">
                                        <p className="text-sm font-semibold">Workspace Name</p>
                                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                                    </div>
                                    <p className="text-sm">{value}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="">
                                <DialogHeader className="p-4 border-b bg-white">
                                    <DialogTitle>Rename workspace</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4" onSubmit={handleEdit}>
                                    <Input
                                        required
                                        autoFocus
                                        minLength={3}
                                        value={value}
                                        maxLength={80}
                                        disabled={isUpdating}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder="Workspace name e.g 'Acme Corp'"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={isUpdating}>
                                                Cancel
                                            </Button>
                                            <Button disabled={isUpdating}>
                                                Save
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <button
                            disabled={isDeleting}
                            onClick={handleDelete}
                            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-neutral-50 text-rose-500"
                        >
                            <Trash className="size-4" />
                            <p className="text-sm font-semibold">Delete workspace</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}