"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, ImageIcon } from "lucide-react";
import { Project } from "@/types/project";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: (id: number) => void;
  isEditing: boolean;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  isEditing,
}: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(project.imageUrl);

  // When project.imageUrl changes, update the state
  useEffect(() => {
    setImageUrl(project.imageUrl);
    setImageError(false); // Reset error state when image URL changes
  }, [project.imageUrl]);

  const handleImageError = () => {
    console.log(`Image error for ${imageUrl}`);
    setImageError(true);
    
    // Attempt to fallback to a different URL format if the current one fails
    if (imageUrl.includes('/public/')) {
      // Try switching to signed URL format
      const path = imageUrl.split('/public/')[1];
      console.log(`Attempting fallback with path: ${path}`);
      // This would be better if implemented with an API route to get a fresh signed URL
    }
  };

  return (
    <Card className={`overflow-hidden ${isEditing ? 'border-blue-500 shadow-blue-100 shadow-lg' : ''}`}>
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-gray-100">
          {imageError ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                <p className="text-gray-500 text-sm mt-2">Image unavailable</p>
                <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto truncate">
                  {imageUrl.length > 40 ? `${imageUrl.substring(0, 40)}...` : imageUrl}
                </p>
              </div>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
              priority={false}
              loading="lazy" 
            />
          )}
          <Badge className="absolute top-2 right-2 capitalize">
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {project.description}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Location:</span>
            <p className="font-medium">{project.location}</p>
          </div>
          <div>
            <span className="text-gray-500">Land Area:</span>
            <p className="font-medium">{project.landArea} katha</p>
          </div>
          <div>
            <span className="text-gray-500">Floors:</span>
            <p className="font-medium">{project.totalFloors}</p>
          </div>
          <div>
            <span className="text-gray-500">Flat Types:</span>
            <p className="font-medium">{project.flatTypes.length}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-red-600 hover:bg-red-50"
          onClick={() => onDelete(project.id)}
        >
          <Trash className="h-4 w-4 mr-2" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}