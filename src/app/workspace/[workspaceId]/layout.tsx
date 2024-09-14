"use client";

import {
    ResizablePanel,
    ResizableHandle,
    ResizablePanelGroup
} from "@/components/ui/resizable";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";
import { Loader } from "lucide-react";
import { usePanel } from "@/hooks/usePanel";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { Id } from "../../../../convex/_generated/dataModel";
import { Profile } from "@/features/members/components/Profile";
import { MessageThread } from "@/features/messages/components/MessageThread";


export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    const { parentMessageId, profileMemberId, onClose } = usePanel();

    const showPanel = !!parentMessageId || !!profileMemberId;

    return (
        <div className="h-full">
            <Toolbar />
            <main className="flex h-[calc(100%-40px)]">
                <Sidebar />
                <ResizablePanelGroup
                    direction="horizontal"
                    autoSaveId="workspace-layout"
                >
                    <ResizablePanel
                        minSize={11}
                        defaultSize={20}
                        className="bg-[#5e2c5f]"
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                        minSize={20}
                        defaultSize={80}
                        className="bg-neutral-50"
                    >
                        {children}
                    </ResizablePanel>
                    {showPanel && (
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel minSize={20} defaultSize={29}>
                                {parentMessageId ? (
                                    <MessageThread
                                        onClose={onClose}
                                        messageId={parentMessageId as Id<"messages">}
                                    />
                                ) : profileMemberId ? (
                                    <Profile 
                                        onClose={onClose}
                                        memberId={profileMemberId as Id<"members">}
                                    />
                                ) :(
                                    <div className="flex h-full items-center justify-center">
                                        <Loader className="size-5 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>

            </main>
        </div >
    );
}