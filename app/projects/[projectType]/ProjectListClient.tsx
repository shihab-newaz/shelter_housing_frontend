"use client";
// app/projects/[projectType]/ProjectListClient.tsx
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface ProjectListClientProps {
  projects: Project[];
  projectType: string;
}

export default function ProjectListClient({ projects, projectType }: ProjectListClientProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  const handleImageError = (projectId: number) => {
    setImageErrors(prev => ({
      ...prev,
      [projectId]: true
    }));
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold text-center mb-8 capitalize">
        {projectType} Projects
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden shadow-lg">
            <CardHeader className="p-0">
              <div className="relative h-64">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  onError={() => handleImageError(project.id)}
                />
                {imageErrors[project.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
                    <div className="text-center">
                      <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                      <p className="text-gray-500 text-sm mt-2">Image could not be loaded</p>
                    </div>
                  </div>
                )}
                <Badge className="absolute top-4 right-4 bg-blue-600">
                  {projectType}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <CardTitle className="text-2xl mb-4">{project.title}</CardTitle>
              <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>{project.location}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span>Starting Price:</span>
                  <span>{project.startingPrice}</span>
                </div> */}
                <div className="flex justify-between">
                  <span>Land Area:</span>
                  <span>{project.landArea} katha</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 bg-gray-50">
              <Link 
                href={`/projects/${projectType}/${project.id}`} 
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
      
      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No {projectType} projects found</p>
        </div>
      )}
    </div>
  );
}