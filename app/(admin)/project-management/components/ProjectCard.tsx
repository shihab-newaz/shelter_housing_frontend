"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, ImageIcon } from "lucide-react";
import { Project } from "@/types/project";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getImageUrl } from "@/app/actions/imageUrlActions"; // Import your image URL resolver

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  isEditing,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: (id: number) => void;
  isEditing: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("/SHL.jpg"); // Default fallback
  const [isLoading, setIsLoading] = useState(true);

  // Process the image URL when the component mounts or when the URL changes
  useEffect(() => {
    async function loadImage() {
      try {
        setIsLoading(true);
        const url = await getImageUrl(project.imageUrl);
        setProcessedImageUrl(url);
        setImageError(false);
      } catch (error) {
        console.error("Failed to process image URL:", error);
        setImageError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadImage();
  }, [project.imageUrl]);

  const handleImageError = () => {
    console.log(`Image loading failed for: ${processedImageUrl}`);
    setImageError(true);
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
                  {processedImageUrl.length > 40 ? `${processedImageUrl.substring(0, 40)}...` : processedImageUrl}
                </p>
              </div>
            </div>
          ) : (
            <Image
              src={processedImageUrl}
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