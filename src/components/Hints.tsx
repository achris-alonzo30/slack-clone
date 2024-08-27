"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip"

interface HintsProps {
    label: string;
    children: React.ReactNode;
    align?: "start" | "center" | "end";
    side?: "top" | "bottom" | "left" | "right";
}

export const Hints = ({
    side,
    align,
    label,
    children,
}: HintsProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent 
                    side={side} 
                    align={align}
                    className="bg-neutral-950 text-neutral-50 border border-white/5"
                >
                    <p className="text-sm font-medium">
                      {label}  
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};