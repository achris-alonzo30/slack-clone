import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

interface HeaderProps {
    memberName?: string;
    memberImage?: string;
    onClick?: () => void;
}

export const Header = ({ 
    onClick,
    memberImage,
    memberName = "Anonymous",
}: HeaderProps) => {
    
    return (
        <header className="bg-neutral-50 border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Button
                size="sm"
                variant="ghost"
                onClick={onClick}
                className="text-lg font-semibold px-2 overflow-hidden w-auto"
            >
                <Avatar className="size-5 rounded-md mr-1">
                    <AvatarImage className="object-cover rounded-md" src={memberImage} />
                    <AvatarFallback className="rounded-md text-sm font-medium text-neutral-300 bg-neutral-950">{memberName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="truncate">{memberName}</span>
                <FaChevronDown className="size-2.5 ml-2" />
            </Button>
        </header>
    )
}