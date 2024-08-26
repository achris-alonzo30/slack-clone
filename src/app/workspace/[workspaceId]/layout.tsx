"use client";

import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";

import {
    ResizablePanel,
    ResizableHandle,
    ResizablePanelGroup
} from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
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
                        className="bg-neutral-300"
                    >
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>

            </main>
        </div>
    );
}