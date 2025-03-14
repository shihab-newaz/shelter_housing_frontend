"use client";

import Image from "next/image";
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

type ProjectStatus = "ongoing" | "completed" | "upcoming";

interface ProjectImageProps {
  src: string;
  alt: string;
}

const ProjectImage = ({ src, alt }: ProjectImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-96 overflow-hidden bg-gray-100">
      <Image
        src={src}
        alt={alt}
        width={2401}
        height={3508}
        className={`
          object-contain w-full h-full
          transition-all duration-700 ease-in-out
          ${
            isLoading
              ? "scale-105 blur-lg grayscale"
              : "scale-100 blur-0 grayscale-0"
          }
        `}
        onLoadingComplete={() => setIsLoading(false)}
        priority={false}
      />
    </div>
  );
};

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
      <div className="relative overflow-hidden">
        <ProjectImage src={project.imageUrl} alt={project.title} />
        <StatusBadge status={status} />
      </div>
    </CardHeader>
    <CardContent className="p-6">
      <CardTitle className="text-2xl mb-2 group-hover:text-blue-600 transition-colors">
        {project.title}
      </CardTitle>
      <CardDescription className="text-gray-600 mb-4">
        Description: {project.description}
      </CardDescription>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Location: {project.location}
        </span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Land Area: {project.landArea} sqft
        </span>
      </div>
      <span className="text-sm text-gray-500">
        Floors: {project.totalFloors}
      </span>
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

export default function ProjectShowcase() {
  const [activeTab, setActiveTab] = useState<ProjectStatus>("ongoing");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        
        // Use the server action instead of the service
        const result = await getProjects(activeTab);
        
        if (result.error) {
          setError(result.error);
        } else if (result.projects) {
          // Only take the first two projects for the showcase
          setProjects(result.projects.slice(0, 2));
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
  }, [activeTab]);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Our Projects</h2>
        <Tabs
          defaultValue="ongoing"
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
              <TabsContent value={activeTab}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      status={activeTab}
                    />
                  ))}
                </div>
                {projects.length > 0 && (
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