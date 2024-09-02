"use client";

import Link from "next/link";
import Image from "next/image";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspacesInfoById } from "@/features/workspaces/api/useGetInfoById";

import { Button } from "@/components/ui/button";
import VerificationInput from "react-verification-input";
import { Loader2 } from "lucide-react";


export default function JoinPage() {
    const workspaceId = useWorkspaceId();

    const { workspaces, isLoading } = useGetWorkspacesInfoById({ workspaceId });
    const { joinWorkspace } = useJoinWorkspace();

    if (isLoading) {
        return (
            <main className="h-full flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </main>
        )
    };
    return (
        <main className="h-full flex flex-col gap-y-8 items-center justify-center bg-neutral-50 p-8 rounded-lg shadow-md">
            <Image 
                width={60}
                height={60}
                src="/logo.svg"
                alt="Slack Logo"
            />
            <section className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <aside className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className="text-2xl font-bold">Join {workspaces?.name}</h1>
                    <p className="text-sm text-neutral-500">Enter workspace code to join</p>
                </aside>
                <VerificationInput 
                    autoFocus
                    length={6}  
                    classNames={{
                        container: "flex gap-x-2",
                        character: "uppercase h-auto rounded-md border border-neutral-200 bg-neutral-100  text-neutral-500 text-center text-lg font-medium",
                        characterInactive: "bg-muted",
                        characterSelected: "bg-primary text-neutral-950",
                        characterFilled: "bg-primary text-neutral-950",
                    }}
                />
            </section>
            <section className="flex gap-x-4">
                <Button
                    asChild
                    size="lg"
                    variant="outline"
                >
                    <Link href="/">Back To Home</Link>
                </Button>
            </section>
        </main>
    )
}