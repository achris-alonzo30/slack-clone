"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useWorkspaceModalState } from "@/features/workspaces/store/useWorkspaceModalState";

export default function Home() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useWorkspaceModalState();

  const { workspaces, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => workspaces?.[0]?._id, [workspaces]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  }, [isLoading, workspaceId, isOpen, setIsOpen]);

  return (
    <main className="h-full w-full flex items-center justify-center">
      {/* From Uiverse.io by SchawnnahJ */}
      <div className="loader" />
    </main>
  );
}
