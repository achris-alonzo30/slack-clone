import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModalState } from "../store/useModalState";

export const CreateWorkspaceModal = () => {
    const [open, setOpen] = useModalState();

    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {}
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create your workspace</DialogTitle>
                </DialogHeader>
            </DialogContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor="workspace-name">Workspace name</label>
                    <Input 
                        required
                        autoFocus
                        minLength={3}
                        type="text" 
                        id="workspace-name" 
                        name="workspace-name"
                        placeholder="Workspace name e.g 'Acme Corp'" 
                        className="w-full"
                    />
                </fieldset>
                <aside className="flex justify-end">
                    <Button 
                        type="submit"
                        disabled={false}
                    >
                        Create
                    </Button>
                </aside>
            </form>
        </Dialog>
    );
};