"use client";

import { useState } from "react";

import { 
    Dialog, 
    DialogTitle,
    DialogHeader,
    DialogFooter,
    DialogContent, 
    DialogDescription,   
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const useConfirm = (
    title: string,
    message: string
) : [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

    const confirm = () => new Promise((resolve) => setPromise({resolve}));

    const handleClose = () => setPromise(null);

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    }

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const ConfirmDialog = () => (
        <Dialog open={promise !== null} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={handleCancel} variant="outline">Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )


    return [ConfirmDialog, confirm];
    
    
}