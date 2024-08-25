"use client";

import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full">
            <Toolbar />
            <main className="flex h-[calc(100%-40px)]">
                <Sidebar />
                {children}
            </main>
        </div>
    );
}