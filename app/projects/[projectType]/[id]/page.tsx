 // app/projects/[projectType]/[id]/page.tsx
  "use client";
  
  import { use } from "react";
  import Image from "next/image";
  import Link from "next/link";
  import { projects } from "@/constants";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { ArrowLeft, MapPin, Mail, Phone, Globe } from "lucide-react";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  export default function ProjectDetailPage({
    params,
  }: {
    params: Promise<{ projectType: string; id: string }>;
  }) {
    const resolvedParams = use(params);
    const { projectType, id } = resolvedParams;
  
    const projectsList = projects[projectType as keyof typeof projects] || [];
    const project = projectsList.find((p) => p.id === parseInt(id));
  
    if (!project) {
      return (
        <div className="container mx-auto px-4 py-24">
          <h1 className="text-4xl font-bold text-center text-red-600">
            Project Not Found
          </h1>
          <div className="text-center mt-8">
            <Link href={`/projects/${projectType}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to {projectType} Projects
              </Button>
            </Link>
          </div>
        </div>
      );
    }
  
    // Extract specifications for easier access
    const specs = project.specifications;
  
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left column - Image and basic info */}
          <div className="lg:col-span-2">
            <div className="relative mb-8">
              <Image
                src={project.image}
                alt={project.title}
                className="rounded-lg shadow-lg object-cover w-full"
                width={800}
                height={600}
              />
              <Badge className="absolute top-4 right-4 bg-blue-600">
                {projectType}
              </Badge>
            </div>
  
            {/* Project overview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-3xl">{project.title}</CardTitle>
                <CardDescription className="text-lg">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-600">Location</h3>
                  <p>{project.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Total Units</h3>
                  <p>{project.units}</p>
                </div>
                {projectType === "ongoing" && (
                  <div className="col-span-2 md:col-span-1">
                    <h3 className="font-semibold text-gray-600 mb-2">Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${project.progress}%` }}
                      >
                        <span className="text-white text-sm">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
  
            {/* Building specifications */}
            {specs && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Building Specifications</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-600">Building Height</h3>
                    <p>{specs.buildingHeight}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Total Floors</h3>
                    <p>{specs.totalFloors} Storied</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600">Land Area</h3>
                    <p>{specs.landArea}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
  
          {/* Right column - Flat types and contact info */}
          <div className="lg:col-span-1">
            {/* Flat Types */}
            {specs?.flatTypes && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Available Flat Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {specs.flatTypes.map((flat, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-semibold">{flat.type}</span>
                      <span>{flat.size} sft</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
  
            {/* Contact Information */}
            {specs && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {specs.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                      <p>{specs.address}</p>
                    </div>
                  )}
                  {specs.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 flex-shrink-0" />
                      <a
                        href={`mailto:${specs.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {specs.email}
                      </a>
                    </div>
                  )}
                  {specs.contact && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                      <div className="space-y-1">
                        {specs.contact.map((phone, index) => (
                          <a
                            key={index}
                            href={`tel:${phone}`}
                            className="block text-blue-600 hover:underline"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {specs.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 flex-shrink-0" />
                      <a
                        href={specs.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
  
        {/* Back button */}
        <div className="mt-12">
          <Link href={`/projects/${projectType}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to {projectType} Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }