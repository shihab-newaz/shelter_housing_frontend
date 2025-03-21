"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Define a placeholder image URL that will always work
const FALLBACK_IMAGE_URL = "/placeholder-building.jpg"; // Place this image in your public directory

/**
 * Server action to get a fresh signed URL for a project image
 * @param imagePath Storage path to the image (e.g., 'projects/a211aa3d1db656012a0de49d2e044ef8.jpg')
 * @param expirySeconds How long the URL should be valid (default: 24 hours)
 * @returns The signed URL or a fallback image URL
 */
export async function getSignedImageUrl(
  imagePath: string,
  expirySeconds: number = 60 * 60 * 24
): Promise<string> {
  try {
    // Make sure we have a valid path
    if (!imagePath || !imagePath.trim()) {
      console.log("No image path provided, using fallback image");
      return FALLBACK_IMAGE_URL;
    }

    // If the path already includes a complete URL, validate and return it
    if (imagePath.startsWith("http")) {
      try {
        // Verify it's a valid URL
        new URL(imagePath);
        return imagePath;
      } catch (error) {
        console.error("Invalid URL format for image:", imagePath);
        return FALLBACK_IMAGE_URL;
      }
    }

    // Clean the path to ensure no leading slashes
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.substring(1)
      : imagePath;

    // For Next.js Image components, we need to handle non-URL paths
    if (!cleanPath.includes("/")) {
      // If it's just a filename, assume it's in the projects folder
      console.log(
        `No path detected in "${cleanPath}", assuming projects folder`
      );
      const fixedPath = `projects/${cleanPath}`;
      console.log(`Attempting with fixed path: ${fixedPath}`);
      return await getSignedUrlFromStorage(fixedPath, expirySeconds);
    }

    // Standard path handling
    return await getSignedUrlFromStorage(cleanPath, expirySeconds);
  } catch (error) {
    console.error("Unexpected error in getSignedImageUrl:", error);
    return FALLBACK_IMAGE_URL;
  }
}

/**
 * Helper function to handle the actual Supabase storage interaction
 */
async function getSignedUrlFromStorage(
  path: string,
  expirySeconds: number
): Promise<string> {

  try {
    // Generate a fresh signed URL
    const { data, error } = await supabase.storage
      .from("project-images")
      .createSignedUrl(path, expirySeconds);

    if (error) {
      console.error("Error generating signed URL:", error);

      // Try alternate bucket if the path might be in a different bucket
      if (
        error.message.includes("400") &&
        error.message.includes("Object not found")
      ) {
        return await tryAlternateBuckets(path, expirySeconds);
      }

      return FALLBACK_IMAGE_URL;
    }

    // Verify the returned URL is valid
    try {
      new URL(data.signedUrl);
      return data.signedUrl;
    } catch (urlError) {
      console.error("Generated invalid URL:", urlError);
      return FALLBACK_IMAGE_URL;
    }
  } catch (error) {
    console.error("Failed to generate signed URL for path:", path, error);
    return FALLBACK_IMAGE_URL;
  }
}

/**
 * Try to find the image in different storage buckets
 */
async function tryAlternateBuckets(
  path: string,
  expirySeconds: number
): Promise<string> {
  // List of possible buckets to try
  const buckets = ["uploads", "images", "public-images"];

  for (const bucket of buckets) {

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expirySeconds);

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    } catch (error) {
      console.log(`Failed with bucket ${bucket}:`, error);
      // Continue to next bucket
    }
  }

  // If no alternate bucket works, return the fallback
  return FALLBACK_IMAGE_URL;
}

/**
 * Server action to process a project and replace image paths with fresh signed URLs
 * @param project The project object with image paths
 * @returns The project with updated image URLs
 */
export async function getProjectWithFreshImageUrls<
  T extends { imageUrl: string }
>(project: T): Promise<T> {
  try {
    if (!project) return project;

    // Make a copy of the project
    const updatedProject = { ...project };

    // Update the main image URL
    if (updatedProject.imageUrl) {
      const freshUrl = await getSignedImageUrl(updatedProject.imageUrl);
      updatedProject.imageUrl = freshUrl;
    } else {
      updatedProject.imageUrl = FALLBACK_IMAGE_URL;
    }

    return updatedProject;
  } catch (error) {
    console.error("Error updating project image URLs:", error);
    // Return project with fallback image if there's an error
    return {
      ...project,
      imageUrl: FALLBACK_IMAGE_URL,
    };
  }
}

/**
 * Server action to process multiple projects and update their image URLs
 * @param projects Array of project objects
 * @returns Array of projects with fresh image URLs
 */
export async function getProjectsWithFreshImageUrls<
  T extends { imageUrl: string }
>(projects: T[]): Promise<T[]> {
  if (!projects || !Array.isArray(projects)) return projects;

  // Process all projects in parallel
  const updatedProjects = await Promise.all(
    projects.map((project) => getProjectWithFreshImageUrls(project))
  );

  return updatedProjects;
}

/**
 * Updates the image URL storage format in the database
 * Use this to migrate from full URLs to storage paths
 * @param projectId The ID of the project to update
 * @param oldUrl The old full URL
 * @returns Success status
 */
export async function updateImageStorageFormat(
  projectId: number,
  oldUrl: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Extract the storage path from the old URL
    const pathMatch = oldUrl.match(/project-images\/(projects\/[^?]+)/);

    if (!pathMatch || !pathMatch[1]) {
      return {
        success: false,
        message: "Could not extract storage path from URL",
      };
    }

    const storagePath = pathMatch[1];

    // Update the project in your database
    // This is a placeholder - replace with your actual database update code
    /*
    await prisma.project.update({
      where: { id: projectId },
      data: { imageUrl: storagePath }
    });
    */

    // Revalidate any paths that might show this project
    revalidatePath(`/projects/ongoing/${projectId}`);
    revalidatePath(`/projects/completed/${projectId}`);
    revalidatePath(`/projects/upcoming/${projectId}`);

    return {
      success: true,
      message: `Updated project ${projectId} to use storage path: ${storagePath}`,
    };
  } catch (error) {
    console.error("Error updating image storage format:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
