"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useModalState } from "@/features/workspaces/store/useModalState";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";

export default function Home() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const [isOpen, setIsOpen] = useModalState();

  const { workspaces, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => workspaces?.[0]!._id, [workspaces]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  }, [isLoading, workspaceId, isOpen, setIsOpen]);

  return (
    <button onClick={() => signOut()}>Sign Out</button>
  );
}
