//app/projects/components/ProjectList.tsx
"use client"

import { ProjectCard } from './ProjectCard'

interface ProjectListProps {
  projects: any[]
  type: string
}

/**
 * ProjectList component renders a grid of project cards
 * Handles the layout and responsiveness of project display
 */
export function ProjectList({ projects, type }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          type={type}
        />
      ))}
    </div>
  )
}