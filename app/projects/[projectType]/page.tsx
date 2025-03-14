"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Project } from "@/types/project";
import { getProjects } from "@/app/actions/projectActions";

export default function ProjectTypePage({ 
  params 
}: { 
  params: Promise<{ projectType: string }> 
}) {
  const resolvedParams = use(params);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Use the server action instead of the service
        const result = await getProjects(
          resolvedParams.projectType as 'completed' | 'ongoing' | 'upcoming'
        );
        
        if (result.error) {
          setError(result.error);
        } else if (result.projects) {
          setProjects(result.projects);
          setError("");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [resolvedParams.projectType]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold text-center mb-8 capitalize">
        {resolvedParams.projectType} Projects
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden shadow-lg">
            <CardHeader className="p-0">
              <div className="relative">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-96"
                />
                <Badge className="absolute top-4 right-4 bg-blue-600">
                  {resolvedParams.projectType}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <CardTitle className="text-2xl mb-4">{project.title}</CardTitle>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>{project.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Starting Price:</span>
                  <span>{project.startingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Land Area:</span>
                  <span>{project.landArea} sqft</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 bg-gray-50">
              <Link 
                href={`/projects/${resolvedParams.projectType}/${project.id}`} 
                className="w-full"
              >
                <Button 
                  className="w-full hover:bg-blue-600 hover:text-white transition-colors"
                  variant="outline"
                >
                  Learn More
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}