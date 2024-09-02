import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useCreateChannel } from "../api/useCreateChannel";
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
    const workspaceId = useWorkspaceId();
    const [open, setOpen] = useChannelModalState();
    const [channelName, setChannelName] = useState("");
    const { mutate, isPending } = useCreateChannel();

    const handleClose = () => {
        setOpen(false);
        setChannelName("");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setChannelName(value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ 
            name: channelName, 
            workspaceId 
        }, {
            onSuccess: (data) => {
                if (data) {
                    toast.success("Channel created successfully");
                    handleClose();
                    router.push(`/workspace/${workspaceId}/channels/${data}`);
                }
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
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
                        type="text"
                        minLength={3}
                        maxLength={80}
                        className="w-full"
                        value={channelName}
                        disabled={isPending}
                        placeholder="e.g. 'General'"
                        onChange={(e) => setChannelName(e.target.value)}
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