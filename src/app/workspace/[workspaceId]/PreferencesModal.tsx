import { 
    Dialog,
    DialogClose,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogContent,
    DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useUpdateWorkspace } from "@/features/workspaces/api/useUpdateWorkspace";

interface PreferencesModalProps {
    isOpen: boolean;
    intialValue: string;
    setIsOpen: (isOpen: boolean) => void;
    
}

export const PreferencesModal = ({
    isOpen,
    setIsOpen,
    intialValue
}: PreferencesModalProps) => {
    const [value, setValue] = useState(intialValue);

    const { mutate, isPending } = useUpdateWorkspace();


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-0 bg-neutral-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle>{value}</DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-neutral-50">
                        <div className="flex ittems-center justify-between">
                            <p className="text-sm font-semibold">Workspace Name</p>
                            <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                        </div>
                        <p className="text-sm">{value}</p>
                    </div>
                    <button 
                        disabled={false}
                        onClick={() => {}}
                        className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-neutral-50 text-rose-500"
                    >
                        <Trash className="size-4"/>
                        <p className="text-sm font-semibold">Delete workspace</p>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}