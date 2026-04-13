import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const vehicleId = formData.get("vehicleId") as string;
        const vehicleNumber = formData.get("vehicleNumber") as string;
        const documentType = formData.get("documentType") as string; // 'rc_url', 'fc_url', etc.

        if (!file || !vehicleId || !vehicleNumber || !documentType) {
            return NextResponse.json({ error: "Missing required fields (file, vehicleId, vehicleNumber, documentType)" }, { status: 400 });
        }

        // 1. ArrayBuffer serialization for Supabase storage
        const buffer = await file.arrayBuffer();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${documentType}.${fileExtension}`;
        // Map buckets logically via Vehicle Numbers
        const filePath = `${vehicleNumber}/${fileName}`;

        // 2. Upload/Optionally Upsert file into Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
            .from("vehicle-documents")
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 });
        }

        // 3. Obtain the Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from("vehicle-documents")
            .getPublicUrl(filePath);

        // 4. Record URL natively back to database row
        const { error: dbError } = await supabaseAdmin
            .from("vehicles")
            .update({ [documentType]: publicUrl })
            .eq("id", vehicleId);

        if (dbError) {
            console.error("Database URL update error:", dbError);
            return NextResponse.json({ error: "File uploaded but database sync failed" }, { status: 500 });
        }

        return NextResponse.json({ message: "Document saved", url: publicUrl }, { status: 201 });
    } catch (err: unknown) {
        console.error("Document upload API Error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { vehicleId, vehicleNumber, documentType, fileUrl } = body;

        if (!vehicleId || !vehicleNumber || !documentType || !fileUrl) {
            return NextResponse.json({ error: "Missing vehicleId, vehicleNumber, documentType, or fileUrl" }, { status: 400 });
        }

        // Extract native path from the full public URL. 
        // We know it was mapped to `[vehicleNumber]/[fileName]`
        // Example URL mapping: ".../storage/v1/object/public/vehicle-documents/AP-02-X-9999/rc_url.pdf"
        const baseUrlMarker = "vehicle-documents/";
        const markerIndex = fileUrl.indexOf(baseUrlMarker);
        
        let filePath = "";
        if (markerIndex !== -1) {
            filePath = fileUrl.substring(markerIndex + baseUrlMarker.length); 
        } else {
             // Fallback if URL structure doesn't precisely match standard public object URLs
             const extension = fileUrl.split('.').pop()?.split('?')[0]; 
             filePath = `${vehicleNumber}/${documentType}.${extension}`;
        }

        // 1. Delete literal file from the Storage Bucket
        const { error: deleteError } = await supabaseAdmin.storage
            .from("vehicle-documents")
            .remove([filePath]);

        if (deleteError) {
             console.error("Failed executing storage removal for ", filePath, deleteError);
             return NextResponse.json({ error: "Failed to delete from storage" }, { status: 500 });
        }

        // 2. Erase Database Column value 
        const { error: dbError } = await supabaseAdmin
            .from("vehicles")
            .update({ [documentType]: null })
            .eq("id", vehicleId);

        if (dbError) {
            console.error("Database wipe fail:", dbError);
            return NextResponse.json({ error: "Deleted storage asset but failed UI database clear" }, { status: 500 });
        }

        return NextResponse.json({ message: "Document deleted successfully" }, { status: 200 });

    } catch (err: unknown) {
        console.error("Document delete API Error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "Internal Server Error" }, { status: 500 });
    }
}
