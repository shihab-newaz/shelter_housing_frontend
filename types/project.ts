// types/project.ts
export interface FlatType {
  type: string;
  size: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  totalFloors: number;
  flatTypes: FlatType[];
  landArea: number;
  status: 'completed' | 'ongoing' | 'upcoming';
  startingPrice: number;
  parking: boolean;
  elevator: boolean;
}

export type NewProject = Omit<Project, 'id'>;