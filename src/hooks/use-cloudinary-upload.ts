
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface UploadResult {
  url: string;
  publicId?: string;
}

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImages = async (files: FileList | File[] | null): Promise<UploadResult[]> => {
    if (!files || files.length === 0) return [];

    const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.error("Cloudinary credentials missing in .env file.");
      toast.error("Upload failed: Cloudinary configuration is missing.");
      return [];
    }

    setIsUploading(true);
    const fileArray = Array.from(files);
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    try {
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Image upload failed.');
        }

        const data = await response.json();
        return { 
            url: data.secure_url,
            publicId: data.public_id
        };
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      toast.error(error.message || "Failed to upload images. Please try again.");
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImages,
    isUploading
  };
}
