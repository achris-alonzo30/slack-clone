import { useState } from "react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";


interface EmojiPopoverProps {
    children: React.ReactNode;
    hint?: string;
    onEmojiSelect: (emoji: string) => void;
}

export const EmojiPopover = ({
    children,
    onEmojiSelect,
    hint = "Select An Emoji",
}: EmojiPopoverProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const onSelect = (emoji: any) => {
        onEmojiSelect(emoji);
        setPopoverOpen(false);

        setTimeout(() => {
            setTooltipOpen
        }, 500);
    }

    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip
                    open={tooltipOpen}
                    delayDuration={50}
                    onOpenChange={setTooltipOpen}
                >
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            {children}
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent
                        sideOffset={4}
                        align="center"
                        className="bg-black text-white border font-medium text-xs border-white/5"
                    >
                        {hint}
                    </TooltipContent>
                </Tooltip>
                <PopoverContent
                    sideOffset={4}
                    align="center"
                    className="p-0 w-full border-none shadow-none"
                >
                    <Picker
                        data={data}
                        onEmojiSelect={onSelect}
                    />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    )
}