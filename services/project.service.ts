// services/project.service.ts
import axios from 'axios';
import { authService } from './auth.service';
import { Project, NewProject } from '@/types/project';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL
});

// Add request interceptor to add auth header
apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ProjectService {
  async getAll(status?: 'completed' | 'ongoing' | 'upcoming'): Promise<Project[]> {
    const response = await apiClient.get('/projects', {
      params: status ? { status } : undefined
    });
    return response.data;
  }

  async getById(id: number): Promise<Project> {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  }

  async create(project: NewProject): Promise<Project> {
    const response = await apiClient.post('/projects', project);
    return response.data;
  }

  async update(id: number, project: Partial<Project>): Promise<Project> {
    const response = await apiClient.put(`/projects/${id}`, project);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  }
}

export const projectService = new ProjectService();