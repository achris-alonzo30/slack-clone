import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMemberById } from "../api/useGetMemberById";

import { AlertTriangle, Loader2, MailIcon, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const Profile = ({
    onClose,
    memberId,
}: {
    onClose: () => void;
    memberId: Id<"members">;
}) => {
    const { member, isLoading } = useGetMemberById({ memberId });
    if (isLoading) {
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
    )
}