import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, UploadCloud, Loader2 } from "lucide-react";
import { DocumentModalProps } from "./documentModal.types";
import { Vehicle } from "@/app/(admin)/vehicles/vehicles.types";
import { 
    DM_DIALOG_CONTENT, 
    DM_GRID_CONTAINER, 
    DM_CARD_CONTAINER,
    DM_CARD_HEADER,
    DM_LOADER_ICON,
    DM_ACTIVE_DOC_WRAPPER,
    DM_BUTTON_VIEW,
    DM_BUTTON_DELETE,
    DM_UPLOAD_WRAPPER,
    DM_UPLOAD_DROPZONE,
    DM_UPLOAD_INPUT_FIELD,
    DM_UPLOAD_ICON_CONTAINER,
    DM_UPLOAD_SUBTITLE
} from "./documentModal.style";

export function DocumentModal({ isOpen, onClose, vehicle, onUpdate }: DocumentModalProps) {
    const [loadingField, setLoadingField] = useState<string | null>(null);
    const [localVehicle, setLocalVehicle] = useState<Vehicle | null>(null);

    // Sync prop to local state so we can mutate cleanly without parent waterfall
    useEffect(() => {
        setLocalVehicle(vehicle);
    }, [vehicle]);

    const docTypes = [
        { key: "rc_url", label: "Registration (RC)" },
        { key: "fc_url", label: "Fitness Certificate (FC)" },
        { key: "insurance_url", label: "Insurance" },
        { key: "permit_url", label: "Permit" },
        { key: "pollution_url", label: "Pollution (PUC)" },
        { key: "tax_url", label: "Road Tax" }
    ];

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
        if (!e.target.files || e.target.files.length === 0 || !vehicle) return;
        const file = e.target.files[0];

        setLoadingField(documentType);
        
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("vehicleId", vehicle.id.toString());
            // Package the human-readable number securely, formatting spaces out for URLs
            formData.append("vehicleNumber", vehicle.vehicle_number.replace(/\s+/g, '-').toUpperCase());
            formData.append("documentType", documentType);

            const res = await fetch("/api/vehicles/documents", {
                method: "POST",
                body: formData
            });

            const resData = await res.json();
            if (!res.ok) {
                throw new Error(resData.error || "Upload failed");
            }

            // Immediately update the local state to show the 'View' button instantly
            if (resData.url) {
                setLocalVehicle(prev => prev ? { ...prev, [documentType]: resData.url } as Vehicle : null);
            }

            onUpdate(); // Trigger parent refetch in the background
        } catch (error: unknown) {
            console.error("Upload error:", error);
            alert(`Failed to upload ${documentType}: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoadingField(null);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (documentType: string, fileUrl: string) => {
        if (!vehicle) return;

        if (!confirm("Are you sure you want to delete this document?")) return;

        setLoadingField(documentType);
        try {
            const res = await fetch("/api/vehicles/documents", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vehicleId: vehicle.id,
                    vehicleNumber: vehicle.vehicle_number.replace(/\s+/g, '-').toUpperCase(),
                    documentType,
                    fileUrl
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Delete failed");
            }

            // Clean the UI up instantly so the 'Upload' button returns immediately
            setLocalVehicle(prev => prev ? { ...prev, [documentType]: null } as Vehicle : null);

            onUpdate();
        } catch (error: unknown) {
            console.error("Delete error:", error);
            alert(`Failed to delete ${documentType}: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setLoadingField(null);
        }
    };

    if (!localVehicle) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={DM_DIALOG_CONTENT}>
                <DialogHeader>
                    <DialogTitle>Document Management</DialogTitle>
                    <DialogDescription>
                        Documents for {localVehicle.vehicle_number} | {localVehicle.company} {localVehicle.model}
                    </DialogDescription>
                </DialogHeader>

                <div className={DM_GRID_CONTAINER}>
                    {docTypes.map((doc) => {
                        const url = localVehicle[doc.key as keyof Vehicle] as string | undefined;
                        const isLoading = loadingField === doc.key;

                        return (
                            <div key={doc.key} className={DM_CARD_CONTAINER}>
                                <div>
                                    <h4 className={DM_CARD_HEADER}>
                                        {doc.label}
                                        {isLoading && <Loader2 className={DM_LOADER_ICON} />}
                                    </h4>
                                </div>
                                
                                {url ? (
                                    <div className={DM_ACTIVE_DOC_WRAPPER}>
                                        <Button variant="outline" size="sm" className={DM_BUTTON_VIEW} asChild>
                                            <a href={url} target="_blank" rel="noreferrer">
                                                <Eye className="h-4 w-4 mr-2" /> View
                                            </a>
                                        </Button>
                                        <Button variant="outline" size="icon" className={DM_BUTTON_DELETE} onClick={() => handleDelete(doc.key, url)} disabled={isLoading}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className={DM_UPLOAD_WRAPPER}>
                                        <div className={DM_UPLOAD_DROPZONE}>
                                            <input 
                                                type="file" 
                                                className={DM_UPLOAD_INPUT_FIELD} 
                                                accept=".pdf,.png,.jpg,.jpeg"
                                                onChange={(e) => handleUpload(e, doc.key)}
                                                disabled={isLoading}
                                            />
                                            <UploadCloud className={DM_UPLOAD_ICON_CONTAINER} />
                                            <span className={DM_UPLOAD_SUBTITLE}>Upload Document</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
