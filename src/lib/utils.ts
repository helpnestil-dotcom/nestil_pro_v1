import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWatermarkedImageUrl(url: string | undefined): string {
  if (!url) return '';
  // Check if it's already watermarked
  if (url.includes('l_text:')) return url;
  
  // Check if it's a valid cloudinary upload URL
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  // The transformation string for "nestil.in" watermark
  const watermark = 'l_text:Arial_60_bold:nestil.in,co_white,o_60,g_center';
  
  // Insert transformation right after /upload/
  return url.replace('/upload/', `/upload/${watermark}/`);
}
