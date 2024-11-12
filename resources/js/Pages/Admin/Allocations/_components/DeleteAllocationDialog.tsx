import React from "react";
import Modal from "@/Components/Modal";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "@/hooks/use-toast";

interface DeleteAllocationDialogProps {
    open: boolean;
    onClose: () => void;
    allocation_id: number;
}

function DeleteAllocationDialog({
    open,
    onClose,
    allocation_id,
}: DeleteAllocationDialogProps) {
    const [processing, setProcessing] = React.useState(false);

    function deleteAllocation(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);

        router.delete(route("allocations.destroy", allocation_id), {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                onClose();
            },
            onError: (error) => {
                if (error.message) {
                    toast({
                        variant: "destructive",
                        description: error.message,
                    });
                }
                setProcessing(false);
            },
        });
    }

    return (
        <Modal show={open} onClose={onClose}>
            <form onSubmit={deleteAllocation} className="p-6">
                <h2 className="text-lg font-medium text-foreground">
                    Are you sure you want to delete this allocation?
                </h2>

                <p className="mt-1 text-sm text-foreground/80">
                    Once an allocation is deleted, it cannot be recovered. So,
                    please make sure you want to delete this allocation before
                    proceeding.
                </p>

                <div className="mt-6 flex justify-end">
                    <Button variant={"outline"} onClick={onClose}>
                        Cancel
                    </Button>

                    <Button
                        variant={"destructive"}
                        className="ms-3"
                        disabled={processing}
                    >
                        Delete Allocation
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default DeleteAllocationDialog;
