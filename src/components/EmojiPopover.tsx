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

interface EmojiPopoverProps {
    children: React.ReactNode;
    hint?: string;
    onEmojiSelect: (emoji: string) => void;
}

export const EmojiPopover = ({
    hint,
    children,
    onEmojiSelect
}: EmojiPopoverProps) => {
    return (
        <Popover>
        </Popover>
    )
}