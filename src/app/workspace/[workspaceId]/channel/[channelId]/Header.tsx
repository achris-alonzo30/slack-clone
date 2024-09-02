import { FaChevronDown } from "react-icons/fa";

import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";


export const Header = ({ channelName }: { channelName: string }) => {
    return (
        <header className="bg-neutral-50 border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="px-2 text-lg overflow-hidden font-semibold w-auto"
                    >
                        <span className="truncate"># {channelName}</span>
                        <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>
            </Dialog>
            <DialogContent className="p-0 bg-neutral-100 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-neutral-50">
                    <DialogTitle># {channelName}</DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <div className="px-5 py-4 bg-neutral-50 rounded-lg border cursor-pointer hover:bg-neutral-100">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">Channel Name</p>
                            <p className="text-sm text-[#126483] hover:underline font-semibold">Edit</p>
                        </div>
                        <p className="text-sm text-neutral-500 font-medium"># {channelName}</p>
                    </div>
                    <button className="flex items-center gap-x-2 px-5 py-4 bg-neutral-50 rounded-lg border cursor-pointer hover:bg-neutral-100 text-rose-500">
                        <Trash className="size-4" />
                        <p className="text-sm font-semibold">Delete channel</p>
                    </button>
                </div>
            </DialogContent>
        </header>
    )
}