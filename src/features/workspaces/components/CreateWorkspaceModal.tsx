import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModalState } from "../store/useModalState";
import { useCreateWorkspace } from "../api/useCreateWorkspaces";

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export const CreateWorkspaceModal = () => {
    const router = useRouter();
    const [open, setOpen] = useModalState();
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
            </DialogContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor="workspace-name">Workspace name</label>
                    <Input 
                        required
                        autoFocus
                        minLength={3}
                        type="text" 
                        className="w-full"
                        id="workspace-name" 
                        name="workspace-name"
                        value={workspaceName}
                        placeholder="Workspace name e.g 'Acme Corp'" 
                        onChange={(e) => setWorkspaceName(e.target.value)}
                    />
                </fieldset>
                <aside className="flex justify-end">
                    <Button 
                        type="submit"
                        disabled={false}
                    >
                        Create
                    </Button>
                </aside>
            </form>
        </Dialog>
    );
};