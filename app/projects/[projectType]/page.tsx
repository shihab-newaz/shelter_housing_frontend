// app/projects/[projecttype]/page.tsx
"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/constants";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectTypePage({ 
  params 
}: { 
  params: Promise<{ projectType: string }> 
}) {
  const resolvedParams = use(params);
  const projectType = resolvedParams.projectType;
  const projectsList = projects[projectType as keyof typeof projects] || [];

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold text-center mb-8 capitalize">
        {projectType} Projects
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsList.map((project) => (
          <Card key={project.id} className="overflow-hidden shadow-lg">
            <CardHeader className="p-0">
              <div className="relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-96"
                />
                <Badge className="absolute top-4 right-4 bg-blue-600">
                  {projectType}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <CardTitle className="text-2xl mb-4">{project.title}</CardTitle>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Location: {project.location}</span>
                <span>Units: {project.units}</span>
              </div>
              
              {projectType === "ongoing" && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              )}
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
    </div>
  );
}