// app/actions/imageActions.ts
"use server";

import { supabase } from "@/lib/supabase";
import { cache } from "react";

// Cached image URL resolution with debugging
export const getImageUrl = cache(async (imagePath: string): Promise<string> => {
  console.log(`getImageUrl: Input path = "${imagePath}"`);
  
  if (!imagePath) {
    console.log("getImageUrl: Empty path, returning fallback");
    return "/SHL.jpg";
  }
  
  if (imagePath.startsWith('http')) {
    console.log("getImageUrl: Already a URL, returning as-is");
    return imagePath;
  }
  
  try {
    // Handle paths with or without the projects/ prefix
    const normalizedPath = imagePath.includes('projects/') 
      ? imagePath 
      : `projects/${imagePath}`;
    
    console.log(`getImageUrl: Normalized path = "${normalizedPath}"`);
    
    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(normalizedPath);
    
    console.log(`getImageUrl: Generated URL = "${data.publicUrl}"`);
    
    return data.publicUrl;
  } catch (error) {
    console.error("getImageUrl: Error generating URL:", error);
    return "/SHL.jpg";
  }
});