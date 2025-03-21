"use client";
// app/components/ProjectShowcaseClient.tsx
import Link from "next/link";
import { useState, useEffect } from "react";
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
import { getProjectsWithFreshImageUrls } from "@/app/actions/imageUrlActions";
import { ProjectImage } from "@/components/common/ProjectImage";

type ProjectStatus = "ongoing" | "completed" | "upcoming";

interface ProjectShowcaseClientProps {
  initialProjects: Project[];
  initialTab: ProjectStatus;
}

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

const ProjectCard = ({
  project,
  status,
}: {
  project: Project;
  status: ProjectStatus;
}) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
    <CardHeader className="p-0">
      <div className="relative h-96 overflow-hidden bg-gray-100">
        <ProjectImage
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 800px) 100vw, 800px"
          priority={false}
          className="object-contain w-full h-full transition-all duration-700 ease-in-out"
          fallbackText="Project image unavailable"
          iconSize={36}
        />
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

export default function ProjectShowcaseClient({ 
  initialProjects,
  initialTab
}: ProjectShowcaseClientProps) {
  const [activeTab, setActiveTab] = useState<ProjectStatus>(initialTab);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(initialProjects.length === 0);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only fetch if changing from the initial tab or if no initial projects were provided
    if (activeTab !== initialTab || initialProjects.length === 0) {
      const fetchProjects = async () => {
        try {
          setIsLoading(true);
          
          // Use the server action to fetch projects
          const result = await getProjects(activeTab);
          
          if (result.error) {
            setError(result.error);
          } else if (result.projects) {
            // Only take the first two projects for the showcase
            const projectsSlice = result.projects.slice(0, 2);
            
            // Explicitly cast status to the correct type to satisfy TypeScript
            const typedProjects = projectsSlice.map(project => ({
              ...project,
              status: project.status as "completed" | "ongoing" | "upcoming"
            }));
            
            // Get fresh image URLs for the projects
            const showcaseProjects = await getProjectsWithFreshImageUrls(typedProjects);
            
            setProjects(showcaseProjects);
            setError("");
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load projects"
          );
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
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <TabsContent value={activeTab} forceMount>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      status={activeTab}
                    />
                  ))}
                </div>
                {projects.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500">No {activeTab} projects found</p>
                  </div>
                ) : (
                  <div className="mt-12 text-center">
                    <Link href={`/projects/${activeTab}`}>
                      <Button
                        variant="outline"
                        className="px-8 py-2 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        See All{" "}
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                        Projects
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </section>
  );
}