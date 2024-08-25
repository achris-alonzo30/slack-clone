"use client";

import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu"

export const UserButton = () => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative" asChild>
                <Avatar className="size-10 hover:opacity-75 cursor-pointer transition-opacity duration-150">
                    <AvatarImage  />
                    <AvatarFallback>
                        
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem>
                    
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}