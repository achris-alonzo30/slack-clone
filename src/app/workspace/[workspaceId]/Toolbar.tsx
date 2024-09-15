import { useState } from "react";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaceById";

import { InfoIcon, Search } from "lucide-react";

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useGetAllMembers } from "@/features/members/api/useGetAllMembers";
import Link from "next/link";
import { useRouter } from "next/navigation";


export const Toolbar = () => {
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const workspaceId = useWorkspaceId();
    const { workspace } = useGetWorkspaceById({ workspaceId });

    const { channels } = useGetChannels({ workspaceId });
    const { members } = useGetAllMembers({ workspaceId });

    const onChannelClick = (channelId: string) => {
        setOpen(false);
        router.push(`/workspace${workspaceId}/channel/${channelId}`)
    }

    const onMemberClick = (memberId: string) => {
        setOpen(false);
        router.push(`/workspace${workspaceId}/member/${memberId}`)
    }

    return (
        <header className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
            <div className="flex-1" />

            <div className="min-w-[280px] max-[642px] grow-[2] shrink">
                <Button
                    size="sm"
                    onClick={() => setOpen(true)}
                    className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
                >
                    <Search className="size-4 text-neutral-300 mr-2" />
                    <span className="text-neutral-300 text-xs">Search {workspace?.name}</span>
                </Button>

                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Channels">
                            {channels?.map((channel) => (
                                <CommandItem 
                                    asChild
                                    key={channel._id}
                                    onSelect={() => onChannelClick(channel._id)} 
                                >
                                    {channel.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Members">
                            {members?.map((member) => (
                                <CommandItem 
                                    asChild
                                    key={member._id} 
                                    onSelect={() => onMemberClick(member._id)}
                                >
                                    {member.user.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
            <nav className="ml-auto flex-1 flex items-center justify-end">
                <Button size="sm" variant="transparent">
                    <InfoIcon className="size-5 text-neutral-300 mr-2" />
                </Button>
            </nav>
        </header>
    );
};