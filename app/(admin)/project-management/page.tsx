// app/(admin)/project-management/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectManagementClient from './ProjectManagementClient';
import { Project } from '@/types/project';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Loading fallback for admin panel
function AdminLoadingFallback() {
  return (
    <div className="container mx-auto py-20 px-4 min-h-screen flex justify-center items-center">
      <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
    </div>
  );
}

// This is a server component
export default async function ProjectManagementPage() {
  // Check if user is authenticated
  const session = await auth();
  
  if (!session) {
    // Redirect to login if not authenticated
    redirect('/login');
  }
  
  // Fetch projects data on the server
  const projectsData = await prisma.project.findMany({
    include: {
      flatTypes: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  // Convert Prisma response to match our Project interface
  const projects: Project[] = projectsData.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: project.imageUrl,
    location: project.location,
    totalFloors: project.totalFloors,
    landArea: project.landArea,
    status: project.status as 'completed' | 'ongoing' | 'upcoming',
    startingPrice: project.startingPrice,
    parking: project.parking,
    elevator: project.elevator,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    flatTypes: project.flatTypes.map(flat => ({
      id: flat.id,
      type: flat.type,
      size: flat.size,
      projectId: flat.projectId
    }))
  }));
  
  // No longer need getProjectsWithFreshImageUrls
  
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <ProjectManagementClient initialProjects={projects} />
    </Suspense>
  );
}