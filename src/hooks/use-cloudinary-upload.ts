'use client';

import { useState } from 'react';

interface UploadResult {
  url: string;
  publicId?: string;
  error?: string;
}

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImages = async (files: FileList | File[] | null): Promise<UploadResult[]> => {
    if (!files || files.length === 0) return [];

    const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log("Starting Cloudinary upload process...");
    console.log("Cloud Name:", CLOUDINARY_CLOUD_NAME ? "Configured" : "MISSING");
    console.log("Upload Preset:", CLOUDINARY_UPLOAD_PRESET ? "Configured" : "MISSING");

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      const msg = "Cloudinary credentials missing in .env.local file.";
      console.error(msg);
      return [{ url: '', error: msg }];
    }

    setIsUploading(true);
    const fileArray = Array.from(files);
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    try {
      const uploadPromises = fileArray.map(async (file) => {
        console.log(`Uploading file: ${file.name} (${file.type}, ${file.size} bytes)`);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Cloudinary API Error:", errorData);
          throw new Error(errorData.error?.message || 'Image upload failed.');
        }

        const data = await response.json();
        console.log("Upload successful:", data.secure_url);
        return { 
            url: data.secure_url,
            publicId: data.public_id
        };
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error: any) {
      console.error("Cloudinary hook error:", error);
      return [{ url: '', error: error.message || "Failed to upload images." }];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImages,
    isUploading
  };
}
