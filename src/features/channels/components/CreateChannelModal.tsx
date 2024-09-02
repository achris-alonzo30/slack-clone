import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChannelModalState } from "../store/useChannelModalState";

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export const CreateChannelModal = () => {
    const router = useRouter();
    const [open, setOpen] = useChannelModalState();
    const [workspaceName, setWorkspaceName] = useState("");

    const handleClose = () => {
        setOpen(false);
        setWorkspaceName("");
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Channel</DialogTitle>
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