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
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Preferences</DialogTitle>
                    <DialogDescription>
                        Customize your workspace preferences
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}