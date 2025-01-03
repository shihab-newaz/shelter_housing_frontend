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

/**
 * ProjectImage component that handles image loading states with smooth transitions
 * and maintains consistent dimensions
 * @param {Object} props - Component properties
 * @param {string} props.src - Source URL of the project image
 * @param {string} props.alt - Alternative text for the image
 * @returns {React.ReactElement} Image component with loading states
 */
const ProjectImage = ({ src, alt }: { src: string; alt: string }) => {
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

/**
 * Status badge component with sage-themed styling
 * @param {Object} props - Component properties
 * @param {string} props.status - Project status (completed, ongoing, upcoming)
 * @returns {React.ReactElement} Styled badge component
 */
const StatusBadge = ({ status }: { status: 'completed' | 'ongoing' | 'upcoming' }): React.ReactElement => {
  const statusColors = {
    completed: "bg-sage-600 hover:bg-sage-700",
    ongoing: "bg-sage-500 hover:bg-sage-600",
    upcoming: "bg-sage-400 hover:bg-sage-500"
  };

  return (
    <Badge 
      className={`absolute top-4 right-4 ${statusColors[status]} text-white transition-colors`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function ProjectShowcase() {
  return (
    <section className="py-24 bg-sage-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-sage-800">Our Projects</h2>
        <Tabs defaultValue="completed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-sage-100">
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-sage-600 data-[state=active]:text-white"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger 
              value="ongoing"
              className="data-[state=active]:bg-sage-600 data-[state=active]:text-white"
            >
              Ongoing
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming"
              className="data-[state=active]:bg-sage-600 data-[state=active]:text-white"
            >
              Upcoming
            </TabsTrigger>
          </TabsList>

          {Object.entries(projects).map(([status, projectList]) => (
            <TabsContent key={status} value={status}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {projectList.map((project) => (
                  <Card
                    key={project.id}
                    className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group bg-white"
                  >
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden">
                        <ProjectImage src={project.image} alt={project.title} />
                        <StatusBadge status={status as 'completed' | 'ongoing' | 'upcoming'} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="text-2xl mb-2 group-hover:text-sage-600 transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-sage-700 mb-4">
                        {project.description}
                      </CardDescription>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-sage-600">
                          Location: {project.location}
                        </span>
                        <span className="text-sm text-sage-600">
                          Units: {project.units}
                        </span>
                      </div>
                      {status === "ongoing" && (
                        <div className="w-full bg-sage-100 rounded-full h-2.5 mb-4">
                          <div
                            className="bg-sage-500 h-2.5 rounded-full transition-all duration-500"
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
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link href={`/projects/${status}`}>
                  <Button
                    variant="outline"
                    className="px-8 py-2 border-sage-500 text-sage-700 hover:bg-sage-600 hover:text-white transition-colors"
                  >
                    See More {status.charAt(0).toUpperCase() + status.slice(1)} Projects
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