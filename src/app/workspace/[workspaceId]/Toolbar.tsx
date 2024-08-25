import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";

import { InfoIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Toolbar = () => {
    const workspaceId = useWorkspaceId();
    const { workspace } = useGetWorkspaceById({ workspaceId });

    return (
        <header className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
            <nav className="flex-1" />

            <ul className="min-w-[280px] max-[642px] grow-[2] shrink">
                <Button
                    size="sm"
                    className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
                >
                    <Search className="size-4 text-neutral-300 mr-2" />
                    <span className="text-neutral-300 text-xs">Search {workspace?.name}</span>
                </Button>
            </ul>
            <nav className="ml-auto flex-1 flex items-center justify-end">
                <Button size="sm" variant="transparent">
                    <InfoIcon className="size-5 text-neutral-300 mr-2" />
                </Button>
            </nav>
        </header>
    );
};