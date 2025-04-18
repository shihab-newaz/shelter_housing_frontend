"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProjectFormWithUpload } from "./components/ProjectForm";
import { ProjectCard } from "./components/ProjectCard";
import { Project } from "@/types/project";
import { Input } from "@/components/ui/input";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/app/actions/projectActions";
import { getProjectWithFreshImageUrls } from "@/app/actions/imageUrlActions";
import { toast } from "@/components/ui/use-toast";

interface ProjectManagementClientProps {
  initialProjects: Project[];
}

export default function ProjectManagementClient({
  initialProjects,
}: ProjectManagementClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await createProject(formData);

      if (result.error) {
        toast.destructive({
          title: "Error",
          description: result.error,
        });
        setError(result.error);
      } else if (result.project) {
        // Get fresh image URL for the newly created project
        const projectWithFreshUrl = await getProjectWithFreshImageUrls(
          result.project
        );

        toast.default({
          title: "Success",
          description: "Project created successfully",
        });

        setProjects([
          {
            ...projectWithFreshUrl,
            status: projectWithFreshUrl.status as
              | "completed"
              | "ongoing"
              | "upcoming",
          },
          ...projects,
        ]);
        setShowForm(false);
        setError("");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.destructive({
        title: "Error",
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      // Refresh the page data
      router.refresh();
    }
  };

  const handleUpdateSubmit = async (formData: FormData) => {
    if (!editingProject) return;

    setIsSubmitting(true);
    try {
      const result = await updateProject(editingProject.id, formData);

      if (result.error) {
        toast.destructive({
          title: "Error",
          description: result.error,
        });
        setError(result.error);
      } else if (result.project) {
        // Get fresh image URL for the updated project
        const projectWithFreshUrl = await getProjectWithFreshImageUrls(
          result.project
        );

        toast.default({
          title: "Success",
          description: "Project updated successfully",
        });

        // Update projects list with updated project
        setProjects(
          projects.map((p) =>
            p.id === projectWithFreshUrl.id
              ? (projectWithFreshUrl as Project)
              : p
          )
        );

        setEditingProject(null);
        setError("");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.destructive({
        title: "Error",
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      // Refresh the page data
      router.refresh();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const result = await deleteProject(id);

      if (result.error) {
        toast.destructive({
          title: "Error",
          description: result.error,
        });
        setError(result.error);
      } else {
        toast.default({
          title: "Success",
          description: "Project deleted successfully",
        });

        // Remove deleted project from list
        setProjects(projects.filter((p) => p.id !== id));

        // If we're currently editing this project, clear the edit state
        if (editingProject?.id === id) {
          setEditingProject(null);
        }

        setError("");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.destructive({
        title: "Error",
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      // Refresh the page data
      router.refresh();
    }
  };

  const handleEdit = useCallback(async (project: Project) => {
    try {
      // Get fresh image URL before editing
      const projectWithFreshUrl = await getProjectWithFreshImageUrls(project);
      setEditingProject(projectWithFreshUrl);
      setShowForm(false); // Close add form if open

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load project image";
      toast.destructive({
        title: "Warning",
        description: errorMessage,
      });
      // Still set the editing project even if image refresh fails
      setEditingProject(project);
    }
  }, []);

  const handleCancel = () => {
    setEditingProject(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    router.push("/login");
  };

  return (
    <div className="container mx-auto py-20 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!editingProject && !showForm && (
        <div className="mb-8">
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Project
          </Button>
        </div>
      )}

      {/* Project Form for Create or Edit */}
      {(editingProject || showForm) && (
        <div className="mb-8">
          {editingProject ? (
            <ProjectFormWithUpload
              project={editingProject}
              onSubmit={handleUpdateSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          ) : (
            <ProjectFormWithUpload
              onSubmit={handleCreateSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      )}

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects
          .filter((project) =>
            project.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => handleEdit(project)}
              onDelete={() => handleDelete(project.id)}
              isEditing={editingProject?.id === project.id}
            />
          ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No projects found</p>
          <Button onClick={() => setShowForm(true)}>
            Add Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}
