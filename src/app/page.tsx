"use client";

import { useModalState } from "@/features/store/useModalState";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect, useMemo } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useModalState();
  const { signOut } = useAuthActions();

  const { workspaces, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => {
    workspaces?.[0]?._id;
  }, [workspaces]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId !== undefined) {
      console.log("workspaceId", workspaceId);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  }, [isLoading, workspaceId, isOpen, setIsOpen]);

  return (
    <button onClick={() => signOut()}>Sign Out</button>
  );
}
