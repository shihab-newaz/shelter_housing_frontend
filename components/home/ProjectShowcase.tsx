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
projects = projects.map((project) => ({
  ...project,
  status: project.status as 'ongoing' | 'completed' | 'upcoming',
}));    
    // Get fresh image URLs for all projects
    projects = await getProjectsWithFreshImageUrls(projects);
  }
  
  return (
    <ProjectShowcaseClient initialProjects={projects} initialTab="ongoing" />
  );
}