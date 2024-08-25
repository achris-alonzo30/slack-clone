"use client";



import { Toolbar } from "./Toolbar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="h-full">
            <Toolbar />
            {children}
        </main>
    );
}