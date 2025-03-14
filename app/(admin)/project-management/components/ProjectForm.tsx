"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Project } from "@/types/project";

interface ProjectFormWithUploadProps {
  project?: Project;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProjectFormWithUpload({
  project,
  onSubmit,
  onCancel,
  isSubmitting
}: ProjectFormWithUploadProps) {
  const [flatTypes, setFlatTypes] = useState<Array<{ type: string; size: string }>>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // If editing, initialize flat types
    if (project) {
      setFlatTypes(project.flatTypes.map(flat => ({
        type: flat.type,
        size: flat.size.toString()
      })));
      
      // Set preview for existing image
      if (project.imageUrl) {
        setPreviewUrl(project.imageUrl);
      }
    }
  }, [project]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setErrors(prev => ({ ...prev, imageFile: '' }));
    }
  };

  const addFlatType = () => {
    setFlatTypes([...flatTypes, { type: "", size: "" }]);
  };

  const removeFlatType = (index: number) => {
    const newFlatTypes = [...flatTypes];
    newFlatTypes.splice(index, 1);
    setFlatTypes(newFlatTypes);
  };

  const updateFlatType = (index: number, field: string, value: string) => {
    const newFlatTypes = [...flatTypes];
    newFlatTypes[index] = { ...newFlatTypes[index], [field]: value };
    setFlatTypes(newFlatTypes);
    
    if (flatTypes.length > 0) {
      setErrors(prev => ({ ...prev, flatTypes: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic form validation
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    
    if (!formData.get('title')) newErrors.title = 'Title is required';
    if (!formData.get('description')) newErrors.description = 'Description is required';
    if (!formData.get('location')) newErrors.location = 'Location is required';
    if (!formData.get('totalFloors')) newErrors.totalFloors = 'Total floors is required';
    if (!formData.get('landArea')) newErrors.landArea = 'Land area is required';
    
    // Check image when creating a new project
    if (!project && !previewUrl) {
      newErrors.imageFile = 'Project image is required';
    }
    
    // Check flat types
    if (flatTypes.length === 0) {
      newErrors.flatTypes = 'At least one flat type is required';
    } else {
      // Check if all flat types have values
      for (let i = 0; i < flatTypes.length; i++) {
        if (!flatTypes[i].type || !flatTypes[i].size) {
          newErrors.flatTypes = 'All flat types must have type and size';
          break;
        }
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear any existing errors
    setErrors({});
    
    // Add flat types to form data
    flatTypes.forEach((flat, index) => {
      formData.append(`flatTypes[${index}].type`, flat.type);
      formData.append(`flatTypes[${index}].size`, flat.size);
    });
    
    // Submit the form
    await onSubmit(formData);
  };

  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Image */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Project Image</div>
            <div className="flex items-center space-x-4">
              {previewUrl && (
                <div className="relative h-32 w-32 rounded overflow-hidden border">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {project && (
                  <input
                    type="hidden"
                    name="imageUrl"
                    value={project.imageUrl}
                  />
                )}
                {errors.imageFile && (
                  <p className="text-sm text-red-500 mt-1">{errors.imageFile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Basic Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium">Title</div>
              <Input
                id="title"
                name="title"
                defaultValue={project?.title}
                placeholder="Project title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Location</div>
              <Input
                id="location"
                name="location"
                defaultValue={project?.location}
                placeholder="Project location"
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Status</div>
              <select 
                name="status" 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                defaultValue={project?.status || "upcoming"}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Starting Price</div>
              <Input
                id="startingPrice"
                name="startingPrice"
                defaultValue={project?.startingPrice || "0"}
                placeholder="Starting price"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Land Area (sqft)</div>
              <Input
                id="landArea"
                name="landArea"
                defaultValue={project?.landArea}
                placeholder="Land area in square feet"
              />
              {errors.landArea && (
                <p className="text-sm text-red-500">{errors.landArea}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Total Floors</div>
              <Input
                id="totalFloors"
                name="totalFloors"
                defaultValue={project?.totalFloors}
                placeholder="Number of floors"
              />
              {errors.totalFloors && (
                <p className="text-sm text-red-500">{errors.totalFloors}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Description</div>
            <Textarea
              id="description"
              name="description"
              defaultValue={project?.description}
              placeholder="Project description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="parking"
                name="parking"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked={project?.parking}
              />
              <div className="text-sm font-medium">Parking Available</div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="elevator"
                name="elevator"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked={project?.elevator}
              />
              <div className="text-sm font-medium">Elevator Available</div>
            </div>
          </div>

          {/* Flat Types */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Flat Types</div>
              <Button
                type="button"
                onClick={addFlatType}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Flat Type
              </Button>
            </div>

            {errors.flatTypes && (
              <Alert variant="destructive">
                <AlertDescription>{errors.flatTypes}</AlertDescription>
              </Alert>
            )}

            {flatTypes.map((flat, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 border rounded-md"
              >
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Type</div>
                    <Input
                      value={flat.type}
                      onChange={(e) =>
                        updateFlatType(index, "type", e.target.value)
                      }
                      placeholder="e.g., 3 Bedroom"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Size (sqft)</div>
                    <Input
                      value={flat.size}
                      onChange={(e) =>
                        updateFlatType(index, "size", e.target.value)
                      }
                      placeholder="e.g., 1200"
                      type="number"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => removeFlatType(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {flatTypes.length === 0 && (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-gray-500">No flat types added yet</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {project ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{project ? "Update Project" : "Create Project"}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}