import imageCompression from 'browser-image-compression';

/**
 * Compress raw image file client-side (< 200KB target) [CA-1.6]
 * Does NOT perform automated background removal (détourage) to prevent UX bugs and slowdowns.
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.25, // ~250KB max
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.warn('Client-side compression fallback to original file:', error);
    return file;
  }
}
