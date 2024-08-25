
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useModalState } from "@/features/workspaces/store/useModalState";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";

import { Loader, Plus } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const WorkspaceSwitcher = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [_open, setOpen] = useModalState();
    const { workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
    const { workspace, isLoading: workspaceLoading } = useGetWorkspaceById({ workspaceId });

    const filteredWorkspaces = workspaces!.filter((w) => w._id !== workspaceId);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button size="sm" className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-neutral-800 font-semibold text-xl">
                    {workspaceLoading ? (
                        <Loader className="size-5 animate-spin shrink-0" />
                    ) : (
                        workspace?.name.charAt(0).toUpperCase()
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-64">
                <DropdownMenuItem
                    onClick={() => router.push(`/workspace/${workspaceId}`)}
                    className="cursor-pointer flex-col justify-start items-start capitalize"
                >
                    {workspace?.name}
                    <span className="text-xs text-neutral-500">
                        Active worlspace
                    </span>
                </DropdownMenuItem>
                {filteredWorkspaces.map((w) => (
                    <DropdownMenuItem
                        key={w._id}
                        onClick={() => router.push(`/workspace/${w._id}`)}
                        className="cursor-pointer flex-col justify-start items-start capitalize"
                    >
                        <div className="shrink-0 size-9 relative overflow-hidden bg-neutral-500 hover:bg-neutral-500/80 text-neutral-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                            {w.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="truncate">{w.name}</p>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                    onClick={() => setOpen(true)}
                    className="cursor-pointer"
                >
                    <div className="size-9 relative overflow-hidden bg-neutral-300 hover:bg-neutral-300/80 text-neutral-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                        <Plus className="size-5" />
                    </div>
                    Create new workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};