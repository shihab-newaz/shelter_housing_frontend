// app/components/ProjectShowcase.tsx
import { getProjects } from "@/app/actions/projectActions";
import { getProjectsWithFreshImageUrls } from "@/app/actions/imageUrlActions";
import { Project } from "@/types/project";
import ProjectShowcaseClient from "./ProjectShowcaseClient";


// This is a server component that fetches initial project data
export default async function ProjectShowcase() {
  // Fetch initial projects (ongoing by default)
  const result = await getProjects('ongoing');
  
  let projects: Project[] = [];
  
  if (!result.error && result.projects) {
    // Only take the first two projects for the showcase
    const projectsSlice = result.projects.slice(0, 2);
    
    // Ensure proper typing of status field
    const typedProjects = projectsSlice.map(project => ({
      ...project,
      status: project.status as "completed" | "ongoing" | "upcoming"
    }));
    
    // Get fresh image URLs for all projects
    projects = await getProjectsWithFreshImageUrls(typedProjects);
  }
  
  return (
    <ProjectShowcaseClient initialProjects={projects} initialTab="ongoing" />
  );
}