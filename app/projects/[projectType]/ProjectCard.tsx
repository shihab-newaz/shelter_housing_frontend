//app/projects/components/ProjectCard.tsx
"use client"

import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/**
 * Type definitions for project data
 */
interface Project {
  id: number
  title: string
  description: string
  image: string
  location: string
  units: number
  progress?: number
}

interface ProjectCardProps {
  project: Project
  type: string
}

/**
 * ProjectCard component renders an individual project with its details
 * Implements hover effects and animations for better user interaction
 */
export function ProjectCard({ project, type }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition duration-300 border-sage-200 group">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={project.image}
            alt={project.title}
            width={400}
            height={300}
            className="w-full object-cover h-[250px] group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-4 right-4 bg-sage-600 hover:bg-sage-700">
            {type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-2xl mb-2 text-sage-800 group-hover:text-sage-600 transition-colors">
          {project.title}
        </CardTitle>
        <CardDescription className="text-sage-600 mb-4">
          {project.description}
        </CardDescription>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-sage-500">
            Location: {project.location}
          </span>
          <span className="text-sm text-sage-500">
            Units: {project.units}
          </span>
        </div>
        {type === 'ongoing' && project.progress !== undefined && (
          <div className="w-full bg-sage-100 rounded-full h-2.5 mb-4">
            <div
              className="bg-sage-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-sage-50 p-6">
        <Button
          variant="outline"
          className="w-full border-sage-500 text-sage-700 hover:bg-sage-600 hover:text-white transition-colors"
        >
          Learn More
        </Button>
      </CardFooter>
    </Card>
  )
}
