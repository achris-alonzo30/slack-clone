import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";
import { useGetMember } from "../api/useGetMember";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useUpdateMember } from "../api/useUpdateMember";
import { useDeleteMember } from "../api/useDeleteMember";
import { useGetMemberById } from "../api/useGetMemberById";
import { Id } from "../../../../convex/_generated/dataModel";


import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, ChevronDownIcon, Loader2, MailIcon, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";



export const Profile = ({
    onClose,
    memberId,
}: {
    onClose: () => void;
    memberId: Id<"members">;
}) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const [UpdateDialog, confirmUpdate] = useConfirm(
        "Update Role",
        "Are you sure you want to update this member's role?",
    );

    const [LeaveDialog, confirmLeave] = useConfirm(
        "Leave Workspace",
        "Are you sure you want to leave this workspace?",
    );

    const [RemoveDialog, confirmRemove] = useConfirm(
        "Remove Member",
        "Are you sure you want to remove this member?",
    );

    const { member, isLoading: isLoadingMember } = useGetMemberById({ memberId });
    const { member: currentMember, isLoading: isLoadingCurrentMember } = useGetMember({ workspaceId });

    const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
    const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();


    const onRemove = async () => {
        const confirmed = await confirmRemove();
        if (!confirmed) return;

        deleteMember({ memberId }, {
            onSuccess: () => {
                toast.success("Member removed successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to remove member");
            }
        });
    }

    const onLeave = async () => {
        const confirmed = await confirmLeave();
        if (!confirmed) return;

        deleteMember({ memberId }, {
            onSuccess: () => {
                router.replace("/")
                toast.success("You have left the workspace");
                onClose();
            },
            onError: () => {
                toast.error("Failed to leave workspace");
            }
        });
    }

    const onUpdate = async (role: "admin" | "member") => {
        const confirmed = await confirmUpdate();
        if (!confirmed) return;

        updateMember({ memberId, role }, {
            onSuccess: () => {
                toast.success("Role changed successfully");
                onClose();
            },
            onError: () => {
                toast.error("Failed to change role");
            }
        });
    }


    if (isLoadingMember || isLoadingCurrentMember) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button
                        size="iconSm"
                        variant="ghost"
                        onClick={onClose}
                    >
                        <X className="size-5 stroke-[1.5" />
                        <span className="sr-only">Close Profile Panel</span>
                    </Button>
                </div>
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    };

    if (!member) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button
                        size="iconSm"
                        variant="ghost"
                        onClick={onClose}
                    >
                        <X className="size-5 stroke-[1.5" />
                        <span className="sr-only">Close Profile Panel</span>
                    </Button>
                </div>
                <div className="h-full flex flex-col gap-y-2 items-center justify-center">
                    <AlertTriangle className="size-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Profile not found</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <UpdateDialog />
            <LeaveDialog />
            <RemoveDialog />
            <section className="h-full flex flex-col">
                <aside className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button
                        size="iconSm"
                        variant="ghost"
                        onClick={onClose}
                    >
                        <X className="size-5 stroke-[1.5" />
                        <span className="sr-only">Close Profile Panel</span>
                    </Button>
                </aside>
                <aside className="flex flex-col items-center justify-center p-4">
                    <Avatar className="max-w-[256px] max-h-[256px] size-5 rounded-md mr-1">
                        <AvatarImage className="object-cover rounded-md" src={member.user.image} />
                        <AvatarFallback className="rounded-md text-6xl font-medium aspect-square text-neutral-300 bg-neutral-950">{member.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </aside>
                <aside className="flex flex-col p-4">
                    <p className="text-xl font-bold">{member.user.name}</p>
                    {currentMember?.role === "admin" && (
                        currentMember?._id === member._id ? (
                            <div className="flex items-center gap-2 mt-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full capitalize"
                                        >
                                            {member.role} <ChevronDownIcon className="size-4 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuRadioGroup 
                                            value={member.role}
                                            onValueChange={(role) => onUpdate(role as "admin" | "member")}
                                        >
                                            <DropdownMenuRadioItem value="admin">
                                                Admin
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="member">
                                                Member
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={onRemove}
                                >
                                    Remove
                                </Button>
                            </div>
                        ) : currentMember?._id === memberId &&
                            currentMember?.role !== "admin" ? (
                            <div className="mt-4">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={onLeave}
                                >
                                    Leave
                                </Button>
                            </div>
                        ) : null
                    )}
                </aside>
                <Separator />
                <aside className="flex flex-col p-4">
                    <p className="text-sm font-bold mb-4">Contact Information:</p>
                    <div className="flex items-center gap-2">
                        <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                            <MailIcon className="size-4" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[13px] font-semibold text-muted-foreground">Email Address</p>
                        </div>
                        <Link
                            href={`mailto:${member.user.email}`}
                            className="text-sm hover:underline text-[#1264a3]"
                        >
                            {member.user.email}
                        </Link>
                    </div>
                </aside>
            </section>
        </>
    )
}