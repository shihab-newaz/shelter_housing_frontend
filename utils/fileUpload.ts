// utils/fileUpload.ts
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @returns The storage path (not the full URL)
 */
export async function uploadFileToStorage(file: File): Promise<string> {
  try {
    // Generate a unique file path
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;
    
    // IMPORTANT: Be consistent with this path format - this is where projects/ gets added
    const filePath = `projects/${fileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = Buffer.from(arrayBuffer);

    console.log(`Attempting to upload to storage path: ${filePath}`);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, fileData, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log(`File uploaded successfully to path: ${filePath}`);
    
    // CRUCIAL: Return just the storage path, exactly as it was used in the upload
    return filePath;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

