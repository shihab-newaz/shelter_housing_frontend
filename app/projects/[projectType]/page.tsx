// app/projects/[projectType]/page.tsx
import { getProjects } from "@/app/actions/projectActions";
import { getProjectsWithFreshImageUrls } from "@/app/actions/imageUrlActions";
import ProjectListClient from "./ProjectListClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Project } from "@/types/project";

type Params = Promise<{
  projectType: string;
}>;

// This is a server component that fetches data
export default async function ProjectTypePage({ 
  params 
}: {
  params: Params;
}) {
  // Await the params Promise to get the actual values
  const resolvedParams = await params;
  const { projectType } = resolvedParams;
  
  // Validate project type
  const validTypes = ['completed', 'ongoing', 'upcoming'];
  
  if (!validTypes.includes(projectType)) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Alert variant="destructive">
          <AlertDescription>Invalid project type</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Cast to the proper type for the API call
  const typedProjectType = projectType as 'completed' | 'ongoing' | 'upcoming';
  
  // Fetch projects using server action
  const result = await getProjects(typedProjectType);
  
  if (result.error) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Alert variant="destructive">
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Make sure we have projects and they're properly typed
  const typedProjects = (result.projects || []).map(project => ({
    ...project,
    status: project.status as 'completed' | 'ongoing' | 'upcoming'
  }));
  
  // Get fresh image URLs for all projects
  const projectsWithFreshUrls = await getProjectsWithFreshImageUrls(typedProjects);
  
  return (
    <ProjectListClient 
      projects={projectsWithFreshUrls} 
      projectType={typedProjectType} 
    />
  );
}