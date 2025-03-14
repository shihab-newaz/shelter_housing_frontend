'use server'

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';
import { Project } from '@/types/project';

// Types for responses
type ProjectResponse = {
  project?: Project;
  error?: string;
  errors?: FormErrors;
  success?: boolean;
};

// Error type for form validation
type FormErrors = {
  [key: string]: string[];
};

// Function to save file to public directory
async function saveFileToPublic(file: File): Promise<string> {
  try {
    console.log("Starting file save process...");
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const fileName = `${randomBytes}.${fileExtension}`;
    
    // Create directory path
    const directoryPath = join(process.cwd(), 'public', 'uploads', 'projects');
    
    // Ensure directory exists
    try {
      await mkdir(directoryPath, { recursive: true });
      console.log(`Directory ensured: ${directoryPath}`);
    } catch (err) {
      console.error('Error creating directory:', err);
    }
    
    const filePath = join(directoryPath, fileName);
    
    // Get file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`File size: ${buffer.length} bytes`);
    console.log(`Saving to: ${filePath}`);
    
    // Save file to public/uploads/projects directory
    await writeFile(filePath, buffer);
    console.log("File saved successfully!");
    
    // Return public URL path
    return `/uploads/projects/${fileName}`;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error(`Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Debug helper to log form data
function logFormData(formData: FormData) {
  console.log("Form data contents:");
  for (const [key, value] of formData.entries()) {
    if (key === 'imageFile') {
      const file = value as File;
      console.log(`${key}: File name: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
}

// Create a new project with file upload support
export async function createProject(formData: FormData): Promise<ProjectResponse> {
  console.log("Create project action called");
  
  // Check authentication
  const session = await auth();
  if (!session) {
    console.log("Authentication failed");
    return { error: 'Unauthorized' };
  }
  
  try {
    // Log form data for debugging
    logFormData(formData);
    
    // Extract and validate basic fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const totalFloors = formData.get('totalFloors') as string;
    const landArea = formData.get('landArea') as string;
    const startingPrice = formData.get('startingPrice') as string || '0';
    const status = formData.get('status') as 'completed' | 'ongoing' | 'upcoming' || 'upcoming';
    const parking = formData.get('parking') === 'on';
    const elevator = formData.get('elevator') === 'on';
    
    console.log("Basic field extraction complete");
    
    // Validate required fields
    const errors: FormErrors = {};
    if (!title) errors.title = ['Title is required'];
    if (!description) errors.description = ['Description is required'];
    if (!location) errors.location = ['Location is required'];
    if (!totalFloors) errors.totalFloors = ['Total floors is required'];
    if (!landArea) errors.landArea = ['Land area is required'];
    
    // Handle file upload
    let imageUrl = '';
    const imageFile = formData.get('imageFile') as File;
    
    if (imageFile && imageFile.size > 0) {
      console.log(`Processing image file: ${imageFile.name} (${imageFile.size} bytes)`);
      try {
        imageUrl = await saveFileToPublic(imageFile);
        console.log(`Image saved, URL: ${imageUrl}`);
      } catch (fileError) {
        console.error("File processing error:", fileError);
        errors.imageFile = [fileError instanceof Error ? fileError.message : 'Failed to save image'];
      }
    } else {
      console.log("No image file provided or file is empty");
      errors.imageFile = ['Project image is required'];
    }
    
    // Extract flat types from form data
    const flatTypesData: { type: string; size: number }[] = [];
    let index = 0;
    
    console.log("Extracting flat types");
    while (formData.has(`flatTypes[${index}].type`)) {
      const type = formData.get(`flatTypes[${index}].type`) as string;
      const sizeStr = formData.get(`flatTypes[${index}].size`) as string;
      const size = parseInt(sizeStr);
      
      console.log(`Flat type ${index}: ${type}, size: ${sizeStr} (${size})`);
      
      if (type && !isNaN(size)) {
        flatTypesData.push({ type, size });
      }
      
      index++;
    }
    
    if (flatTypesData.length === 0) {
      console.log("No valid flat types found");
      errors.flatTypes = ['At least one flat type is required'];
    }
    
    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      return { error: 'Validation failed', errors };
    }
    
    console.log("Creating project in database");
    
    // Create the project in the database
    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        location,
        totalFloors,
        landArea,
        status,
        startingPrice,
        parking,
        elevator,
        flatTypes: {
          create: flatTypesData
        }
      },
      include: {
        flatTypes: true
      }
    });
    
    console.log(`Project created successfully with ID: ${project.id}`);
    
    // Revalidate paths to update the UI
    revalidatePath('/project-management');
    revalidatePath(`/projects/${status}`);
    
    return { project: project as unknown as Project };
  } catch (error) {
    console.error('Error creating project:', error);
    return { 
      error: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Update an existing project
export async function updateProject(id: number, formData: FormData): Promise<ProjectResponse> {
  console.log(`Update project action called for ID: ${id}`);
  
  // Check authentication
  const session = await auth();
  if (!session) {
    return { error: 'Unauthorized' };
  }
  
  try {
    // Log form data for debugging
    logFormData(formData);
    
    // First check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: { flatTypes: true }
    });
    
    if (!existingProject) {
      return { error: 'Project not found' };
    }
    
    // Extract and validate basic fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const totalFloors = formData.get('totalFloors') as string;
    const landArea = formData.get('landArea') as string;
    const startingPrice = formData.get('startingPrice') as string || existingProject.startingPrice;
    const status = formData.get('status') as 'completed' | 'ongoing' | 'upcoming' || existingProject.status as 'completed' | 'ongoing' | 'upcoming';
    const parking = formData.get('parking') === 'on';
    const elevator = formData.get('elevator') === 'on';
    
    // Validate required fields
    const errors: FormErrors = {};
    if (!title) errors.title = ['Title is required'];
    if (!description) errors.description = ['Description is required'];
    if (!location) errors.location = ['Location is required'];
    if (!totalFloors) errors.totalFloors = ['Total floors is required'];
    if (!landArea) errors.landArea = ['Land area is required'];
    
    // Handle file upload
    let imageUrl = existingProject.imageUrl;
    const imageFile = formData.get('imageFile') as File;
    
    if (imageFile && imageFile.size > 0) {
      console.log(`Processing updated image file: ${imageFile.name} (${imageFile.size} bytes)`);
      try {
        // Upload new image to public directory
        imageUrl = await saveFileToPublic(imageFile);
        console.log(`New image saved, URL: ${imageUrl}`);
      } catch (fileError) {
        console.error("File processing error:", fileError);
        errors.imageFile = [fileError instanceof Error ? fileError.message : 'Failed to save image'];
      }
    } else {
      // Keep existing image URL from hidden input
      const existingImageUrl = formData.get('imageUrl') as string;
      if (existingImageUrl) {
        imageUrl = existingImageUrl;
        console.log(`Using existing image URL: ${imageUrl}`);
      }
    }
    
    // Extract flat types from form data
    const flatTypesData: { type: string; size: number }[] = [];
    let index = 0;
    
    while (formData.has(`flatTypes[${index}].type`)) {
      const type = formData.get(`flatTypes[${index}].type`) as string;
      const sizeStr = formData.get(`flatTypes[${index}].size`) as string;
      const size = parseInt(sizeStr);
      
      console.log(`Flat type ${index}: ${type}, size: ${sizeStr} (${size})`);
      
      if (type && !isNaN(size)) {
        flatTypesData.push({ type, size });
      }
      
      index++;
    }
    
    if (flatTypesData.length === 0) {
      errors.flatTypes = ['At least one flat type is required'];
    }
    
    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      return { error: 'Validation failed', errors };
    }
    
    console.log("Updating project in database");
    
    // Update the project in the database using a transaction
    const project = await prisma.$transaction(async (tx) => {
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
          imageUrl,
          location,
          totalFloors,
          landArea,
          status,
          startingPrice,
          parking,
          elevator,
          flatTypes: {
            create: flatTypesData
          }
        },
        include: {
          flatTypes: true
        }
      });
    });
    
    console.log(`Project updated successfully: ${project.id}`);
    
    // Revalidate paths to update the UI
    revalidatePath('/project-management');
    revalidatePath(`/projects/${status}`);
    
    return { project: project as unknown as Project };
  } catch (error) {
    console.error('Error updating project:', error);
    return { 
      error: `Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Other functions remain the same...
export async function deleteProject(id: number): Promise<ProjectResponse> {
  // Check authentication
  const session = await auth();
  if (!session) {
    return { error: 'Unauthorized' };
  }
  
  try {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!project) {
      return { error: 'Project not found' };
    }
    
    // Delete the project (cascade delete will remove flat types)
    await prisma.project.delete({
      where: { id }
    });
    
    // Revalidate paths to update the UI
    revalidatePath('/project-management');
    revalidatePath('/projects/upcoming');
    revalidatePath('/projects/ongoing');
    revalidatePath('/projects/completed');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { error: 'Failed to delete project' };
  }
}

export async function getProjects(status?: 'completed' | 'ongoing' | 'upcoming'): Promise<{ projects?: Project[]; error?: string }> {
  try {
    const projects = await prisma.project.findMany({
      where: status ? { status } : undefined,
      include: {
        flatTypes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return { projects: projects as unknown as Project[] };
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return { error: 'Failed to fetch projects' };
  }
}

export async function getProjectById(id: number): Promise<{ project?: Project; error?: string }> {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        flatTypes: true
      }
    });
    
    if (!project) {
      return { error: 'Project not found' };
    }
    
    return { project: project as unknown as Project };
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return { error: 'Failed to fetch project' };
  }
}