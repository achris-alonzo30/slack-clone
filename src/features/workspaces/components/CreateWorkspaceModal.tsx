import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
    DialogDescription,
} from "@/components/ui/dialog";
import { useModalState } from "../store/useModalState";

export const CreateWorkspaceModal = () => {
    const [open, setOpen] = useModalState();

    const handleClose = () => {
        setOpen(false);
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create your workspace</DialogTitle>
                </DialogHeader>
            </DialogContent>

        </Dialog>
    );
};