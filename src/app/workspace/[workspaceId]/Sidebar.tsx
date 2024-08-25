import { UserButton } from "@/features/auth/components/UserButton";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export const Sidebar = () => {
    return (
        <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-1">
            <WorkspaceSwitcher />
            <nav className="flex flex-col items-center justify-center gap-y-1 mt-auto">
                <UserButton />
            </nav>
        </aside>
    );
};