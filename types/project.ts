// types/project.ts
export interface FlatType {
  id?: number;
  type: string;
  size: number;
  projectId?: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  totalFloors: string;
  landArea: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  startingPrice: string;
  parking: boolean;
  elevator: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  flatTypes: FlatType[];
}

// For creating a new project (without id)
export interface NewProject {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  totalFloors: string;
  landArea: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  startingPrice: string;
  parking: boolean;
  elevator: boolean;
  flatTypes: FlatType[];
}