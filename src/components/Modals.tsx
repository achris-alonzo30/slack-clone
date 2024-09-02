"use client";

import { useState, useEffect } from "react";
import { CreateChannelModal } from "@/features/channels/components/CreateChannelModal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/CreateWorkspaceModal";

export const Modals = () => {
    const [mounted, setMounted] = useState(false);

    // prevent hydration error
    useEffect(() => {
        console.log("Mounted");
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <CreateWorkspaceModal />
            <CreateChannelModal />
        </>
    )
}