import { supabase } from './supabaseClient';

/**
 * Upload file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @returns Public URL of uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string = 'recordings',
  path?: string
): Promise<string> {
  try {
    const fileName = path || `${Date.now()}-${file.name}`;
    
    // Placeholder upload logic
    // Real implementation will upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Delete file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}
