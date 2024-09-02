import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";

import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";


const userItemVariants = cva(
    "flex items-center justify-start gap-x-2 text-sm font-medium h-7 px-4 overflow-hidden",
    {
        variants: {
            variant: {
                default: "text-[#f9edffcc",
                active: "text-[#481349] bg-neutral-50/90"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)


interface UserItemProps {
    id: Id<"members">;
    label?: string;
    image?: string;
    variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({
    id,
    image,
    variant,
    label = "Member",
}: UserItemProps) => {
    const workspaceId = useWorkspaceId();
    const avatarFallback = label.charAt(0).toUpperCase();
    return (
        <Button
            asChild
            size="sm"
            variant="transparent"
            className={cn(userItemVariants({ variant }))}
        >
            <Link href={`/workspace/${workspaceId}/member/${id}`}>
                <Avatar className="size-5 rounded-md mr-1">
                    <AvatarImage className="object-cover rounded-md" src={image} />
                    <AvatarFallback className="rounded-md text-sm font-medium text-neutral-300 bg-neutral-950">{avatarFallback}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate text-neutral-50">{label}</span>
            </Link>

        </Button>
    )
}