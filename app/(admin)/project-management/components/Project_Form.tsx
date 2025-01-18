import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Project, NewProject } from '@/types/project'

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Project | NewProject) => void;
  onCancel?: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<NewProject>({
    title: project?.title || '',
    description: project?.description || '',
    imageUrl: project?.imageUrl || '',
    location: project?.location || '',
    totalFloors: project?.totalFloors || 0,
    flatTypes: project?.flatTypes || [{ type: '', size: 0 }],
    landArea: project?.landArea || 0,
    status: project?.status || 'upcoming',
    startingPrice: project?.startingPrice || 0,
    parking: project?.parking || false,
    elevator: project?.elevator || false
  });

  // Helper function to handle number inputs
  const handleNumberInput = (value: string, field: keyof NewProject) => {
    const number = value === '' ? 0 : Number(value);
    setFormData({ ...formData, [field]: isNaN(number) ? 0 : number });
  };

  // Helper function to handle flat type number inputs
  const handleFlatTypeNumber = (value: string, index: number) => {
    const number = value === '' ? 0 : Number(value);
    const newFlatTypes = [...formData.flatTypes];
    newFlatTypes[index].size = isNaN(number) ? 0 : number;
    setFormData({ ...formData, flatTypes: newFlatTypes });
  };

  const addFlatType = () => {
    setFormData({
      ...formData,
      flatTypes: [...formData.flatTypes, { type: '', size: 0 }]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? 'Edit Project' : 'Add New Project'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Name</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter project name (e.g., Jamal Tower)"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter detailed project description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Project Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="Enter project image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Project Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter full address"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalFloors">Total Floors</Label>
              <Input
                id="totalFloors"
                name="totalFloors"
                type="number"
                min="0"
                placeholder="Number of floors (G+n)"
                value={formData.totalFloors}
                onChange={(e) => handleNumberInput(e.target.value, 'totalFloors')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="landArea">Land Area</Label>
              <Input
                id="landArea"
                name="landArea"
                type="number"
                min="0"
                step="0.01"
                placeholder="Area in Katha"
                value={formData.landArea}
                onChange={(e) => handleNumberInput(e.target.value, 'landArea')}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startingPrice">Starting Price (BDT)</Label>
            <Input
              id="startingPrice"
              name="startingPrice"
              type="number"
              min="0"
              placeholder="Enter price in BDT"
              value={formData.startingPrice}
              onChange={(e) => handleNumberInput(e.target.value, 'startingPrice')}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Apartment Types</Label>
            {formData.flatTypes.map((flatType, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Type (e.g., Type-A, Type-B)"
                    value={flatType.type}
                    onChange={(e) => {
                      const newFlatTypes = [...formData.flatTypes];
                      newFlatTypes[index].type = e.target.value;
                      setFormData({...formData, flatTypes: newFlatTypes});
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Size in sq.ft"
                    value={flatType.size.toString()}
                    onChange={(e) => handleFlatTypeNumber(e.target.value, index)}
                    required
                  />
                </div>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={addFlatType}>
              Add Another Apartment Type
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'completed' | 'ongoing' | 'upcoming') => 
                setFormData({...formData, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Facilities</Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.parking}
                  onChange={(e) => setFormData({...formData, parking: e.target.checked})}
                  className="rounded border-gray-300"
                />
                Basement Parking
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.elevator}
                  onChange={(e) => setFormData({...formData, elevator: e.target.checked})}
                  className="rounded border-gray-300"
                />
                Passenger Elevator
              </label>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <Button onClick={() => onSubmit(formData)}>
            {project ? 'Update Project' : 'Add Project'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}