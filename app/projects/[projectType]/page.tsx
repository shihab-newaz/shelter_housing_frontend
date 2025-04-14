// app/projects/[projectType]/page.tsx
import { getProjects } from "@/app/actions/projectActions";
import ProjectListClient from "./ProjectListClient";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

type Params = Promise<{
  projectType: string;
}>;

// Loading fallback
function ProjectsLoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-24 flex justify-center items-center">
      <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
    </div>
  );
}

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
  
  // No need for getProjectsWithFreshImageUrls anymore
  
  return (
    <Suspense fallback={<ProjectsLoadingFallback />}>
      <ProjectListClient 
        projects={typedProjects} 
        projectType={typedProjectType} 
      />
    </Suspense>
  );
}