import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { cva, type VariantProps } from "class-variance-authority";

import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "@/components/ui/button";


const sidebarItemVariants = cva(
    "flex items-center justify-start gap-x-2 text-sm font-medium h-7 px-[18px] overflow-hidden",
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

interface SidebarItemProps {
    id: string;
    label: string;
    icon: LucideIcon | IconType;
    variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}


export const SidebarItem = ({
    id,
    label,
    variant,
    icon: Icon,
}: SidebarItemProps) => {
    const workspaceId = useWorkspaceId();
    return (
        <Button
            asChild
            size="sm"
            variant="transparent"
            className={cn(sidebarItemVariants({ variant }))}
        >
            <Link href={`/workspace/${workspaceId}/channel/${id}`}>
                <Icon className="size-3.5 mr-1 shrink-0" />
                <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}