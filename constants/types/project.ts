// constants/types/project.ts
export interface FlatType {
  type: string;
  size: number;
}

/**
 * Contains detailed specifications for a building project
 */
export interface ProjectSpecifications {
  buildingHeight: string;
  totalFloors: number;
  landArea: string;
  flatTypes: FlatType[];
  amenities?: string[];
  address?: string;
  email?: string;
  contact?: string[];
  website?: string;
}


export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  units: number;
  progress: number;
  specifications?: ProjectSpecifications;
}


export interface ProjectsData {
  completed: Project[];
  ongoing: Project[];
  upcoming: Project[];
}