// app/projects/[projectType]/[id]/page.tsx
import { getProjectById } from "@/app/actions/projectActions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import ProjectDetailClient from "./ProjectDetailClient";
import { Project } from "@/types/project";
import { Suspense } from "react";

type Params = Promise<{
  projectType: string;
  id: string;
}>;

// Loading fallback
function ProjectDetailLoadingFallback() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
    </div>
  );
}

// This is a server component that fetches data
export default async function ProjectDetailPage({
  params,
}: {
  params: Params;
}) {
  // Await the params Promise to get the actual values
  const resolvedParams = await params;
  const { projectType, id } = resolvedParams;
  
  // Validate project type
  const validTypes = ['completed', 'ongoing', 'upcoming'];
  
  if (!validTypes.includes(projectType)) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Alert variant="destructive">
          <AlertDescription>Invalid project type</AlertDescription>
        </Alert>
        <div className="text-center mt-8">
          <Link href="/projects">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Parse and validate the project ID
  const projectId = parseInt(id);
  
  if (isNaN(projectId)) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Alert variant="destructive">
          <AlertDescription>Invalid project ID</AlertDescription>
        </Alert>
        <div className="text-center mt-8">
          <Link href={`/projects/${projectType}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to {projectType} Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Fetch project data using server action
  const result = await getProjectById(projectId);
  
  if (result.error || !result.project) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Alert variant="destructive">
          <AlertDescription>{result.error || "Project not found"}</AlertDescription>
        </Alert>
        <div className="text-center mt-8">
          <Link href={`/projects/${projectType}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to {projectType} Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // No need for getProjectWithFreshImageUrls
  const project = result.project as Project;
  
  return (
    <Suspense fallback={<ProjectDetailLoadingFallback />}>
      <ProjectDetailClient 
        project={project}
        projectType={projectType}
      />
    </Suspense>
  );
}