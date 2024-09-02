import { useToggle } from "react-use";
import { PlusIcon } from "lucide-react";
import { FaCaretRight } from "react-icons/fa";

import { Hints } from "@/components/Hints";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkspaceSectionProps {
    label: string;
    hint: string;
    onNew: () => void;
    children: React.ReactNode;
}

export const WorkspaceSection = ({
    hint,
    label,
    onNew,
    children
}: WorkspaceSectionProps) => {
    const [on, toggle] = useToggle(true);

    return (
        <div className="flex flex-col mt-3 px-2">
            <div className="flex items-center px-3.5 group">
                <Button
                    onClick={toggle}
                    variant="transparent"
                    className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
                >
                    <FaCaretRight className={cn("size-4 transition-transform duration-300 ease-in-out", on && "rotate-90")} />
                </Button>
                <Button
                    size="sm"
                    variant="transparent"
                    className="group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start overflow-hidden items-center"
                >
                    <span className="truncate">{label}</span>
                </Button>
                {onNew && (
                    <Hints label={hint} side="top" align="center">
                        <Button
                            size="iconSm"
                            onClick={onNew}
                            variant="transparent"
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] duration-300 ease-in-out size-6 shrink-0"
                        >
                            <PlusIcon className="size-5" />
                        </Button>
                    </Hints>
                )}
            </div>
            {on && children}
        </div>
    )
}