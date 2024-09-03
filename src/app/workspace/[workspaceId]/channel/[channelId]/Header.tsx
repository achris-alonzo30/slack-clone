import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";
import { useChannelId } from "@/hooks/useChannelId";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useUpdateChannel } from "@/features/channels/api/useUpdateChannel";
import { useDeleteChannel } from "@/features/channels/api/useDeleteChannel";

import { Trash } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetMember } from "@/features/members/api/useGetMember";

export const Header = ({ channelName }: { channelName: string }) => {
    const router = useRouter();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure you want to delete this channel?",
        "This action cannot be undone.",
    );
    const [editOpen, setEditOpen] = useState(false);
    const [value, setValue] = useState(channelName);

    const { member } = useGetMember({ workspaceId });
    const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
    const { mutate: deleteChannel, isPending: isDeletingChannel } = useDeleteChannel();

    const handleEditOpen = (value: boolean) => {
        if (member?.role !== "admin") return;

        setEditOpen(value);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);
    }

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateChannel({
            channelId,
            channelName: value
        }, {
            onSuccess: () => {
                toast.success("Channel updated");
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update channel");
            }
        });
    }

    const handleDelete = async () => {
        const confirmed = await confirm();

        if (!confirmed) return;

        deleteChannel({ channelId }, {
            onSuccess: () => {
                toast.success("Channel deleted");
                router.push(`/workspace/${workspaceId}`);
            },
            onError: () => {
                toast.error("Failed to delete channel");
            }
        });
    }

    return (
        <header className="bg-neutral-50 border-b h-[49px] flex items-center px-4 overflow-hidden">
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="px-2 text-lg overflow-hidden font-semibold w-auto"
                    >
                        <span className="truncate"># {channelName}</span>
                        <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>
            <DialogContent className="p-0 bg-neutral-100 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-neutral-50">
                    <DialogTitle># {channelName}</DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                        <DialogTrigger asChild>
                            <div className="px-5 py-4 bg-neutral-50 rounded-lg border cursor-pointer hover:bg-neutral-100">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">Channel Name</p>
                                    {member?.role === "admin" && (
                                        <p className="text-sm text-[#126483] hover:underline font-semibold">Edit</p>
                                    )}
                                </div>
                                <p className="text-sm text-neutral-500 font-medium"># {channelName}</p>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="">
                            <DialogHeader className="p-4 border-b bg-white">
                                <DialogTitle>Rename channel</DialogTitle>
                            </DialogHeader>
                            <form className="space-y-4" onSubmit={handleEdit}>
                                <Input
                                    required
                                    autoFocus
                                    minLength={3}
                                    value={value}
                                    maxLength={80}
                                    disabled={isUpdatingChannel}
                                    onChange={handleChange}
                                    placeholder="Channel name"
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" disabled={isUpdatingChannel}>Cancel</Button>
                                    </DialogClose>
                                    <Button disabled={isUpdatingChannel}>Save</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    {member?.role === "admin" && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeletingChannel}
                            className="flex items-center gap-x-2 px-5 py-4 bg-neutral-50 rounded-lg border cursor-pointer hover:bg-neutral-100 text-rose-500">
                            <Trash className="size-4" />
                            <p className="text-sm font-semibold">Delete channel</p>
                        </button>
                    )}
                </div>
            </DialogContent>
            </Dialog>
        </header>
    )
}