// app/components/ProjectShowcase.tsx
import { getProjects } from "@/app/actions/projectActions";
import { Project } from "@/types/project";
import ProjectShowcaseClient from "./ProjectShowcaseClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Loading fallback for the entire showcase
function ShowcaseLoadingFallback() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Our Projects</h2>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        </div>
      </div>
    </section>
  );
}

// This is a server component that fetches initial project data
export default async function ProjectShowcase() {
  // Fetch initial projects (ongoing by default)
  const result = await getProjects('ongoing');
  
  let projects: Project[] = [];
  
  if (!result.error && result.projects) {
    // Only take the first two projects for the showcase
    const projectsSlice = result.projects.slice(0, 2);
    
    // Ensure proper typing of status field
    projects = projectsSlice.map(project => ({
      ...project,
      status: project.status as "completed" | "ongoing" | "upcoming"
    }));
    
  }
  
  return (
    <Suspense fallback={<ShowcaseLoadingFallback />}>
      <ProjectShowcaseClient initialProjects={projects} initialTab="ongoing" />
    </Suspense>
  );
}