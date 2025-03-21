// app/projects/[projectType]/[id]/page.tsx
import { getProjectById } from "@/app/actions/projectActions";
import { getProjectWithFreshImageUrls } from "@/app/actions/imageUrlActions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectDetailClient from "./ProjectDetailClient";
import { Project } from "@/types/project";

// This is a server component that fetches data
export default async function ProjectDetailPage({
  params,
}: {
  params: { projectType: string; id: string };
}) {
  // Validate project type
  const validTypes = ['completed', 'ongoing', 'upcoming'];
  const projectType = params.projectType;
  
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
  const projectId = parseInt(params.id);
  
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
  
  // Get fresh image URL for the project
  const projectWithFreshUrl = await getProjectWithFreshImageUrls(result.project as Project);
  
  return (
    <ProjectDetailClient 
      project={projectWithFreshUrl}
      projectType={projectType}
    />
  );
}