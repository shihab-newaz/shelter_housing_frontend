"use client";
// app/projects/[projectType]/[id]/ProjectDetailClient.tsx
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Building,
  Home,
  Car,
  ImageIcon,
  LucideHome,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/types/project";

interface ProjectDetailClientProps {
  project: Project;
  projectType: string;
}

export default function ProjectDetailClient({ 
  project, 
  projectType 
}: ProjectDetailClientProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 mb-20">
        {/* Left column - Full height image */}
        <div className="relative h-screen lg:sticky lg:top-0">
          <div className="relative w-full h-full mt-20">
            <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            priority
            className="object-contain"
            onError={handleImageError}
          />
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
              <div className="text-center">
                <ImageIcon className="h-20 w-20 mx-auto text-gray-400" />
                <p className="text-gray-500 text-lg mt-4">Image could not be loaded</p>
              </div>
            </div>
          )}
            <Badge className="absolute top-4 right-4 bg-blue-600">
              {projectType}
            </Badge>
          </div>
        </div>

        {/* Right column - Content */}
        <div className="px-4 lg:px-8 py-12 lg:py-24">
          {/* Project overview */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl">{project.title}</CardTitle>
              <CardDescription className="text-lg">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-600">Location</h3>
                <p>{project.location}</p>
              </div>
              {/* <div>
                <h3 className="font-semibold text-gray-600">Starting Price</h3>
                <p>{project.startingPrice ? project.startingPrice : "Call For Price"}</p>
              </div> */}
              <div>
                <h3 className="font-semibold text-gray-600">Land Area</h3>
                <p>{project.landArea} katha</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600">Total Floors</h3>
                <p>{project.totalFloors}</p>
              </div>
            </CardContent>
          </Card>

          {/* Building features */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Building Features</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Total Floors</h3>
                  <p>{project.totalFloors}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Parking</h3>
                  <p>{project.parking ? "Available" : "Not Available"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LucideHome className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Elevator</h3>
                  <p>{project.elevator ? "Available" : "Not Available"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Prime Location</h3>
                  <p>Yes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flat types */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Available Flat Types</CardTitle>
              <CardDescription>
                Choose from our variety of thoughtfully designed layouts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.flatTypes.map((flat, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">{flat.type}</p>
                      <p className="text-sm text-gray-600">{flat.size} sqft</p>
                    </div>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Back button */}
          <Link href={`/projects/${projectType}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to {projectType} Projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}