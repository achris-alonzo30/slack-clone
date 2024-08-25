import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"
import { Button } from "@/components/ui/button";

interface SidebarButtonProps {
    icon: LucideIcon | IconType;
    label: string;
    isActive?: boolean;
}

export const SidebarButton = ({
    icon: Icon,
    label,
    isActive
}: SidebarButtonProps) => {
    return (
        <nav className="flex flex-col items-center justify-center gap-y-1 cursor-pointer group">
            <Button 
                variant="transparent" 
                className={cn(
                    "size-9 p-2 group-hover:bg-accent/20",
                    isActive && "bg-accent/20"
                )}
            >
                <Icon className="size-5 text-neutral-100 group-hover:scale-110 transition-all" />
            </Button>
            <span className="text-xs text-neutral-100 group-hover:text-accent">
                {label}
            </span>
        </nav>
    )
}