import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModalState } from "../store/useModalState";
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
    const [open, setOpen] = useModalState();
    const { mutate } = useCreateWorkspace();
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
                handleClose();
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
                        minLength={3}
                        type="text" 
                        className="w-full"
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