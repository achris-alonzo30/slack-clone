import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceModalState } from "../store/useWorkspaceModalState";
import { useCreateWorkspace } from "../api/useCreateWorkspace";

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CreateWorkspaceModal = () => {
    const router = useRouter();
    const [open, setOpen] = useWorkspaceModalState();
    const { mutate, isPending } = useCreateWorkspace();
    const [workspaceName, setWorkspaceName] = useState("");

    const handleClose = () => {
        setOpen(false);
        setWorkspaceName("");
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ name: workspaceName }, {
            onSuccess: (workspaceId) => {
                toast.success("Workspace created");
                router.push(`/workspace/${workspaceId}`);
                setOpen(false);
                setWorkspaceName("");
            },
            onError: (error) => {
                toast.error(error.message);
            }
        })
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create your workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        required
                        autoFocus
                        type="text"
                        minLength={3}
                        maxLength={80}
                        className="w-full"
                        disabled={isPending}
                        value={workspaceName}
                        placeholder="Workspace name e.g 'Acme Corp'"
                        onChange={(e) => setWorkspaceName(e.target.value)}
                    />
                    <aside className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={false}
                        >
                            Create
                        </Button>
                    </aside>
                </form>
            </DialogContent>

        </Dialog>
    );
};