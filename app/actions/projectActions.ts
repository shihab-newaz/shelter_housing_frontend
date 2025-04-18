'use server'

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth, requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * Upload a file to Supabase Storage and return the public URL
 * @param file The file to upload
 * @returns The complete public URL (not just the path)
 */
async function uploadFileToStorage(file: File): Promise<string> {
  try {
    console.log(`uploadFileToStorage: Starting upload for file "${file.name}"`);
    
    // Generate a unique file path
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = `projects/${fileName}`;
    
    console.log(`uploadFileToStorage: Generated path = "${filePath}"`);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = Buffer.from(arrayBuffer);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, fileData, {
        contentType: file.type,
        cacheControl: '31536000', // 1 year
        upsert: true
      });

    if (error) {
      console.error('uploadFileToStorage: Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);
      
    console.log(`uploadFileToStorage: Uploaded successfully, public URL = "${publicUrlData.publicUrl}"`);
    
    // For debugging existing patterns in your app
    console.log(`uploadFileToStorage: Previously would have returned path = "${filePath}"`);
    
    // Return the complete public URL instead of just the path
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('uploadFileToStorage: File upload error:', error);
    throw error;
  }
}

// Get all projects, optionally filtered by status
export async function getProjects(status?: 'completed' | 'ongoing' | 'upcoming') {
  try {
    const projects = await prisma.project.findMany({
      where: status ? { status } : undefined,
      include: {
        flatTypes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return { projects }
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return { error: 'Failed to fetch projects' }
  }
}

// Get a project by ID
export async function getProjectById(id: number) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        flatTypes: true
      }
    })
    
    if (!project) {
      return { error: 'Project not found' }
    }
    
    return { project }
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return { error: 'Failed to fetch project' }
  }
}

// Create a new project
export async function createProject(formData: FormData) {
  // Require authentication
  await requireAuth()
  
  try {
    // Process the image file first
    const imageFile = formData.get('imageFile') as File;
    if (!imageFile || imageFile.size === 0) {
      return { error: 'Project image is required' };
    }
    
    // Upload to Supabase and get the storage path
    const imageStoragePath = await uploadFileToStorage(imageFile);

    // Extract other form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const totalFloors = formData.get('totalFloors') as string;
    const landArea = formData.get('landArea') as string;
    const startingPrice = formData.get('startingPrice') as string || '0';
    const status = formData.get('status') as 'completed' | 'ongoing' | 'upcoming' || 'upcoming';
    const parking = formData.get('parking') === 'on';
    const elevator = formData.get('elevator') === 'on';
    
    // Basic validation
    if (!title || !description || !location || !totalFloors || !landArea) {
      return { error: 'All required fields must be provided' };
    }
    
    // Process flat types
    const flatTypes: Array<{ type: string; size: number }> = [];
    let index = 0;
    
    while (formData.has(`flatTypes[${index}].type`)) {
      const type = formData.get(`flatTypes[${index}].type`) as string;
      const sizeStr = formData.get(`flatTypes[${index}].size`) as string;
      const size = parseInt(sizeStr);
      
      if (type && !isNaN(size)) {
        flatTypes.push({ type, size });
      }
      
      index++;
    }
    
    if (flatTypes.length === 0) {
      return { error: 'At least one flat type is required' };
    }
    
    // Create the project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        // Store just the storage path, not the full URL
        imageUrl: imageStoragePath,
        location,
        totalFloors,
        landArea,
        status,
        startingPrice,
        parking,
        elevator,
        flatTypes: {
          create: flatTypes
        }
      },
      include: {
        flatTypes: true
      }
    });
    
    revalidatePath('/project-management');
    revalidatePath(`/projects/${status}`);
    
    return { project };
  } catch (error) {
    console.error('Failed to create project:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to create project' 
    };
  }
}

// Update an existing project
export async function updateProject(id: number, formData: FormData) {
  // Require authentication
  await requireAuth()
  
  try {
    // First check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: { flatTypes: true }
    });
    
    if (!existingProject) {
      return { error: 'Project not found' };
    }
    
    let imageUrl = existingProject.imageUrl;
    
    // Process image if a new one is provided
    const imageFile = formData.get('imageFile') as File;
    if (imageFile && imageFile.size > 0) {
      // Upload new image
      imageUrl = await uploadFileToStorage(imageFile);
    } else {
      // Keep existing image path
      const existingImageUrl = formData.get('imageUrl') as string;
      if (existingImageUrl) {
        imageUrl = existingImageUrl;
      }
    }
    
    // Extract other form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const totalFloors = formData.get('totalFloors') as string;
    const landArea = formData.get('landArea') as string;
    const startingPrice = formData.get('startingPrice') as string || existingProject.startingPrice;
    const status = formData.get('status') as 'completed' | 'ongoing' | 'upcoming' || existingProject.status as 'completed' | 'ongoing' | 'upcoming';
    const parking = formData.get('parking') === 'on';
    const elevator = formData.get('elevator') === 'on';
    
    // Basic validation
    if (!title || !description || !location || !totalFloors || !landArea) {
      return { error: 'All required fields must be provided' };
    }
    
    // Process flat types
    const flatTypes: Array<{ type: string; size: number }> = [];
    let index = 0;
    
    while (formData.has(`flatTypes[${index}].type`)) {
      const type = formData.get(`flatTypes[${index}].type`) as string;
      const sizeStr = formData.get(`flatTypes[${index}].size`) as string;
      const size = parseInt(sizeStr);
      
      if (type && !isNaN(size)) {
        flatTypes.push({ type, size });
      }
      
      index++;
    }
    
    if (flatTypes.length === 0) {
      return { error: 'At least one flat type is required' };
    }
    
    // Update the project with transaction to handle related records
    const updatedProject = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete existing flat types
      await tx.flatType.deleteMany({
        where: { projectId: id }
      });
      
      // Update the project
      return tx.project.update({
        where: { id },
        data: {
          title,
          description,
          imageUrl, // Store the path, not the full URL
          location,
          totalFloors,
          landArea,
          status,
          startingPrice,
          parking,
          elevator,
          flatTypes: {
            create: flatTypes
          }
        },
        include: {
          flatTypes: true
        }
      });
    });
    
    revalidatePath('/project-management');
    revalidatePath(`/projects/${status}`);
    
    return { project: updatedProject };
  } catch (error) {
    console.error('Failed to update project:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to update project' 
    };
  }
}

// Delete a project
export async function deleteProject(id: number) {
  // Require authentication
  await requireAuth()
  
  try {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id },
      select: { imageUrl: true }
    });
    
    if (!project) {
      return { error: 'Project not found' };
    }
    
    // Delete the project from database (cascade will handle flat types)
    await prisma.project.delete({
      where: { id }
    });
    
    // Try to delete the image from storage if it exists
    if (project.imageUrl && !project.imageUrl.startsWith('http')) {
      try {
        const { error } = await supabase.storage
          .from('project-images')
          .remove([project.imageUrl]);
          
        if (error) {
          console.warn('Failed to delete image from storage:', error);
          // Continue even if image deletion fails
        }
      } catch (storageError) {
        console.warn('Error during storage deletion:', storageError);
        // Continue even if image deletion fails
      }
    }
    
    revalidatePath('/project-management');
    revalidatePath('/projects/upcoming');
    revalidatePath('/projects/ongoing');
    revalidatePath('/projects/completed');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { error: 'Failed to delete project' };
  }
}