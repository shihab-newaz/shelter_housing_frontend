"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Project } from "@/types/project";
import { getProjects } from "@/app/actions/projectActions";
import { SuspenseImage } from "@/components/common/SuspenseImage";

type ProjectStatus = "ongoing" | "completed" | "upcoming";

interface ProjectShowcaseClientProps {
  initialProjects: Project[];
  initialTab: ProjectStatus;
}

// Status badge component
const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  const statusColors = {
    completed: "bg-blue-600",
    ongoing: "bg-green-600",
    upcoming: "bg-amber-600",
  };

  return (
    <Badge className={`absolute top-4 right-4 ${statusColors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Loading placeholder
const ProjectsLoadingState = () => (
  <div className="flex justify-center items-center h-96">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

// Individual project card component with suspense image
const ProjectCard = ({ project, status }: { project: Project; status: ProjectStatus }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
    <CardHeader className="p-0">
      <div className="relative h-96 overflow-hidden bg-gray-100">
        <Suspense fallback={
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        }>
          <SuspenseImage
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 800px) 100vw, 800px"
            className="object-contain w-full h-full transition-all duration-500 ease-in-out"
          />
        </Suspense>
        <StatusBadge status={status} />
      </div>
    </CardHeader>
    <CardContent className="p-6">
      <CardTitle className="text-2xl mb-2 group-hover:text-blue-600 transition-colors">
        {project.title}
      </CardTitle>
      <CardDescription className="text-gray-600 mb-4 line-clamp-3">
        {project.description}
      </CardDescription>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Location:</span>
          <span className="text-sm font-medium">{project.location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Land Area:</span>
          <span className="text-sm font-medium">{project.landArea} katha</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Floors:</span>
          <span className="text-sm font-medium">{project.totalFloors}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter className="bg-gray-50 p-6">
      <Link href={`/projects/${status}/${project.id}`} className="w-full">
        <Button
          variant="outline"
          className="w-full hover:bg-blue-600 hover:text-white transition-colors"
        >
          Learn More
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

// Project grid component
const ProjectGrid = ({ projects, status }: { projects: Project[]; status: ProjectStatus }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} status={status} />
      ))}
    </div>
    {projects.length === 0 ? (
      <div className="text-center py-16">
        <p className="text-gray-500">No {status} projects found</p>
      </div>
    ) : (
      <div className="mt-12 text-center">
        <Link href={`/projects/${status}`}>
          <Button
            variant="outline"
            className="px-8 py-2 hover:bg-blue-600 hover:text-white transition-colors"
          >
            See All {status.charAt(0).toUpperCase() + status.slice(1)} Projects
          </Button>
        </Link>
      </div>
    )}
  </>
);

// Main component
export default function ProjectShowcaseClient({
  initialProjects,
  initialTab,
}: ProjectShowcaseClientProps) {
  const [activeTab, setActiveTab] = useState<ProjectStatus>(initialTab);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(initialProjects.length === 0);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only fetch if changing tabs or no initial projects
    if (activeTab !== initialTab || initialProjects.length === 0) {
      const fetchProjects = async () => {
        try {
          setIsLoading(true);
          const result = await getProjects(activeTab);

          if (result.error) {
            setError(result.error);
          } else if (result.projects) {
            // Take first two projects for showcase
            const projectsSlice = result.projects.slice(0, 2);
            const typedProjects = projectsSlice.map((project) => ({
              ...project,
              status: project.status as "completed" | "ongoing" | "upcoming",
            }));
            
            // No need for getProjectsWithFreshImageUrls - our SuspenseImage handles URLs
            setProjects(typedProjects);
            setError("");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load projects");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProjects();
    }
  }, [activeTab, initialTab, initialProjects.length]);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Our Projects</h2>
        <Tabs
          defaultValue={initialTab}
          className="w-full"
          onValueChange={(value) => setActiveTab(value as ProjectStatus)}
        >
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <div className="min-h-[400px]">
            {isLoading ? (
              <ProjectsLoadingState />
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <TabsContent value={activeTab} forceMount>
                <Suspense fallback={<ProjectsLoadingState />}>
                  <ProjectGrid projects={projects} status={activeTab} />
                </Suspense>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </section>
  );
}