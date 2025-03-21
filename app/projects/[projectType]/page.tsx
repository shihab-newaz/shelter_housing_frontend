// app/projects/[projectType]/page.tsx
import { getProjects } from "@/app/actions/projectActions";
import { getProjectsWithFreshImageUrls } from "@/app/actions/imageUrlActions";
import ProjectListClient from "./ProjectListClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Project } from "@/types/project";

// This is a server component that fetches data
export default async function ProjectTypePage({ 
  params 
}: { 
  params: { projectType: string }
}) {
  // Validate project type
  const validTypes = ['completed', 'ongoing', 'upcoming'];
  const projectType = params.projectType as 'completed' | 'ongoing' | 'upcoming';
  
  if (!validTypes.includes(projectType)) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Alert variant="destructive">
          <AlertDescription>Invalid project type</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Fetch projects using server action
  const result = await getProjects(projectType);
  
  if (result.error) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Alert variant="destructive">
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Get fresh image URLs for all projects
  const projectsWithFreshUrls = await getProjectsWithFreshImageUrls(result.projects as Project[]);
  
  return (
    <ProjectListClient 
      projects={projectsWithFreshUrls} 
      projectType={projectType} 
    />
  );
}