"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../api/useCurrentUser";

import { Loader2, LogOut } from "lucide-react";

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
    const { signOut } = useAuthActions();
    const { user, isLoading } = useCurrentUser();

    if (isLoading) {
        return (
            <span className="size-10 rounded-md bg-neutral-500 animate-pulse transition-colors"/>
        )
    };

    if (!user) return null;

    const avatarFallback = user.name!.charAt(0).toUpperCase();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative" asChild>
                <Avatar className="size-10 rounded-md hover:opacity-75 cursor-pointer transition-opacity duration-150">
                    <AvatarImage alt={user.name!} src={user.image!} />
                    <AvatarFallback className="text-neutral-300 bg-neutral-950">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem onClick={() => signOut()} className="h-10">
                    <LogOut className="size-4 mr-2" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}