"use client";

import { useState, useEffect } from "react";
import { CreateWorkspaceModal } from "@/features/workspaces/components/CreateWorkspaceModal";

export const Modals = () => {
    const [mounted, setMounted] = useState(false);

    // prevent hydration error
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return  (
        <>
            <CreateWorkspaceModal />
        </>
    )
}