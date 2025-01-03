"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { projects } from "@/constants";

// Define strongly typed interfaces
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  units: number;
  progress: number;
}

type ProjectType = keyof typeof projects;
type ProjectListing = Record<ProjectType, Project[]>;

const typedProjects = projects as ProjectListing;

const ProjectImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-[400px] overflow-hidden bg-sage-50">
      <Image
        src={src}
        alt={alt}
        width={600}
        height={400}
        className={`
          object-contain w-full h-full
          transition-all duration-700 ease-in-out
          ${isLoading ? "scale-105 blur-lg grayscale" : "scale-100 blur-0 grayscale-0"}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        priority={false}
      />
    </div>
  );
};

type ProjectCardProps = {
  project: Project;
  status: ProjectType;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, status }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group bg-white">
    <CardHeader className="p-0">
      <div className="relative">
        <ProjectImage src={project.image} alt={project.title} />
        <Badge className="absolute top-4 right-4 bg-sage-600">
          {status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      <CardTitle className="text-2xl mb-2 group-hover:text-sage-600 transition-colors">
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
      {status === "ongoing" && (
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
        className="w-full hover:bg-sage-600 hover:text-white transition-colors"
      >
        Learn More
      </Button>
    </CardFooter>
  </Card>
);

export default function ProjectShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Our Projects</h2>
        <Tabs defaultValue="completed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          {(Object.entries(typedProjects) as [ProjectType, Project[]][]).map(([status, projectList]) => (
            <TabsContent key={status} value={status}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {projectList.map((project: Project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    status={status}
                  />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link href={`/projects/${status}`}>
                  <Button
                    variant="outline"
                    className="px-8 py-2 hover:bg-sage-600 hover:text-white transition-colors"
                  >
                    See More {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
                    Projects
                  </Button>
                </Link>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}