
import { 
    Bell, 
    Home, 
    Plus,
    MessagesSquare, 
    MoreHorizontal
} from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarButton } from "./SidebarButton";
import { Button } from "@/components/ui/button";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { UserButton } from "@/features/auth/components/UserButton";


export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-1">
            <WorkspaceSwitcher />
            <SidebarButton 
                icon={Home}
                label="Home"
                isActive={true}
            />
            <SidebarButton 
                icon={MessagesSquare}
                label="DMs"
                isActive={false}
            />
            <SidebarButton 
                icon={Bell}
                label="Activity"
                isActive={false}
            />
            <SidebarButton 
                icon={MoreHorizontal}
                label="More"
                isActive={false}
            />
            <nav className="flex flex-col items-center justify-center gap-y-2 mt-auto mb-5">
                <Button size="icon" variant="transparent" className="rounded-full" >
                    <Plus className="size-5" />
                </Button>
                <UserButton />
            </nav>
        </aside>
    );
};