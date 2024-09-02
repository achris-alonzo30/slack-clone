import { useState } from "react";
import { Doc } from "../../../../convex/_generated/dataModel";


import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Hints } from "@/components/Hints";
import { Button } from "@/components/ui/button";
import { PreferencesModal } from "./PreferencesModal";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { InviteModal } from "./InviteModal";


export const WorkspaceHeader = ({
    isAdmin,
    workspace
}: {
    isAdmin: boolean;
    workspace: Doc<"workspaces">
}) => {
    const [preferencesModalIsOpen, setPreferencesModalIsOpen] = useState(false);
    const [inviteModalIsOpen, setInviteModalIsOpen] = useState(false);
    return (
        <>
            <InviteModal 
                isOpen={inviteModalIsOpen}
                setIsOpen={setInviteModalIsOpen}
                name={workspace.name}
                joinCode={workspace.joinCode}
            />
            <PreferencesModal
                isOpen={preferencesModalIsOpen}
                setIsOpen={setPreferencesModalIsOpen}
                intialValue={workspace.name} 
            />
            <nav className="flex items-center justify-between h-[49px] gap-0.5 px-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="sm"
                            variant="transparent"
                            className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
                        >
                            <span className="truncate overflow-ellipsis whitespace-nowrap">
                                {workspace.name}
                            </span>
                            <ChevronDown className="size-4 ml-2 shrink-0" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="start" className="w-64">
                        <DropdownMenuItem className="w-full cursor-pointer justify-start capitalize">
                            <div className="size-9 relative overflow-hidden bg-neutral-700 text-white font-semibold text-xl  rounded-md flex items-center justify-center mr-2">
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col items-starttruncate overflow-ellipsis whitespace-nowrap">
                                <p className="text-sm font-semibold">{workspace.name}</p>
                                <p className="text-xs text-neutral-500">Active Workspace</p>
                            </div>
                        </DropdownMenuItem>
                        {isAdmin && (
                            <>
                                <DropdownMenuItem
                                    onClick={() => { }}
                                    className="w-full cursor-pointer py-1 text-sm text-neutral-700"
                                >
                                    Invite people to this workspace
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setPreferencesModalIsOpen(true)}
                                    className="w-full cursor-pointer py-1 text-sm text-neutral-700"
                                >
                                    Preferences
                                </DropdownMenuItem>
                            </>
                        )}

                    </DropdownMenuContent>
                </DropdownMenu>
                <ul className="flex items-center gap-0.5">
                    <Hints label="Filter" side="bottom">
                        <Button
                            size="iconSm"
                            variant="transparent"
                        >
                            <ListFilter className="size-4" />
                            <span className="sr-only">Filter</span>
                        </Button>
                    </Hints>

                    <Hints label="New Message" side="bottom">
                        <Button
                            size="iconSm"
                            variant="transparent"
                        >
                            <SquarePen className="size-4" />
                            <span className="sr-only">New Message</span>
                        </Button>
                    </Hints>

                </ul>
            </nav>
        </>
    )
}