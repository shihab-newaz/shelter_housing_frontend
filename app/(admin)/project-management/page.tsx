"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProjectForm } from './components/Project_Form'
import { ProjectCard } from './components/Project_Card'
import { Project, NewProject } from '@/types/project'
import { projectService } from '@/services/project.service'
import { authService } from '@/services/auth.service'
import { AxiosError } from 'axios'

export default function AdminPanel() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Authentication check
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
      setError("");
    } catch (err) {
      handleError(err, 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (projectId: number) => {
    setIsProjectLoading(true);
    try {
      // Fetch fresh project data when editing
      const projectData = await projectService.getById(projectId);
      setEditingProject(projectData);
      setError("");
    } catch (err) {
      handleError(err, 'Failed to load project details');
      setEditingProject(null);
    } finally {
      setIsProjectLoading(false);
    }
  };

  const handleSubmit = async (projectData: Project | NewProject) => {
    try {
      let result: Project;
      
      if ('id' in projectData) {
        // Update existing project
        result = await projectService.update(projectData.id, projectData);
        setProjects(projects.map(p => p.id === result.id ? result : p));
        setEditingProject(null);
      } else {
        // Create new project
        result = await projectService.create(projectData);
        setProjects([...projects, result]);
      }
      
      setError("");
    } catch (err) {
      const action = 'id' in projectData ? 'update' : 'add';
      handleError(err, `Failed to ${action} project`);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await projectService.delete(id);
      setProjects(projects.filter(p => p.id !== id));
      setError("");
      // If we're currently editing this project, clear the edit state
      if (editingProject?.id === id) {
        setEditingProject(null);
      }
    } catch (err) {
      handleError(err, 'Failed to delete project');
    }
  };

  const handleError = (err: unknown, defaultMessage: string) => {
    const errorMessage = err instanceof AxiosError 
      ? err.response?.data?.message || err.message
      : defaultMessage;
    setError(errorMessage);
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-8">
        {isProjectLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ProjectForm 
            project={editingProject || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setEditingProject(null)}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={() => handleEdit(project.id)}
            onDelete={handleDelete}
            isEditing={editingProject?.id === project.id}
          />
        ))}
      </div>
    </div>
  );
}