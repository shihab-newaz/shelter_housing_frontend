// components/ProjectCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from 'lucide-react'
import { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  isEditing: boolean;
}

export function ProjectCard({ project, onEdit, onDelete,isEditing }: ProjectCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{project.description}</p>
        <div className="space-y-1 text-sm">
          <p><strong>Location:</strong> {project.location}</p>
          <p><strong>Total Floors:</strong> G+{project.totalFloors}</p>
          <p><strong>Land Area:</strong> {project.landArea} Katha</p>
          <p><strong>Starting Price:</strong> ৳{project.startingPrice.toLocaleString()}</p>
          <p><strong>Status:</strong> {project.status}</p>
          
          <div className="mt-2">
            <p><strong>Flat Types:</strong></p>
            <ul className="list-disc list-inside">
              {project.flatTypes.map((flat, index) => (
                <li key={index}>
                  {flat.type}: {flat.size} sqft
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 mt-2">
            {project.parking && <span className="bg-green-100 px-2 py-1 rounded text-xs">Parking</span>}
            {project.elevator && <span className="bg-green-100 px-2 py-1 rounded text-xs">Elevator</span>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(project)}>
          <Pencil className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(project.id)}>
          <Trash className="w-4 h-4 mr-2" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}