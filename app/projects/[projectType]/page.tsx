// app/projects/[projectType]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { projects } from '@/constants'
import { Metadata } from 'next'

/**
 * Type definitions for project-related data structures
 */
type ProjectType = 'upcoming' | 'ongoing' | 'completed'

interface Project {
  id: number
  title: string
  description: string
  image: string
  location: string
  units: number
  progress?: number
}

interface PageProps {
  params: {
    projectType: ProjectType
  }
}

/**
 * Valid project types for validation
 */
const VALID_PROJECT_TYPES: ProjectType[] = ['upcoming', 'ongoing', 'completed']

/**
 * Generate static paths for all project type pages
 */
export function generateStaticParams() {
  return VALID_PROJECT_TYPES.map(type => ({
    projectType: type
  }))
}

/**
 * Generate metadata for SEO optimization
 */
export function generateMetadata({ params }: PageProps): Metadata {
  const type = params.projectType.toLowerCase()

  if (!VALID_PROJECT_TYPES.includes(type as ProjectType)) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.',
    }
  }

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1)
  return {
    title: `${capitalizedType} Projects | Shelter Housing`,
    description: `Explore our ${type} real estate projects at Shelter Housing Ltd - Building sustainable communities and exceptional homes.`,
  }
}

/**
 * Project card component for displaying individual project information
 */
function ProjectCard({ project, type }: { project: Project; type: ProjectType }) {
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

/**
 * Projects page component displaying projects filtered by type
 * Implements proper type checking and validation for project types
 */
export default function ProjectsPage({ params }: PageProps) {
  // Validate the project type parameter
  if (!VALID_PROJECT_TYPES.includes(params.projectType)) {
    notFound()
  }

  const projectList = projects[params.projectType]

  return (
    <div className="py-24 bg-sage-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-16 capitalize text-sage-800 font-playfair">
          {params.projectType} Projects
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectList.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              type={params.projectType}
            />
          ))}
        </div>
      </div>
    </div>
  )
}