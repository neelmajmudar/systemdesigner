"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { slugify } from "@/lib/slug";
import type { Project } from "@/types/project";

export type ProjectDialogType = "create" | "rename" | "delete";

interface UseProjectActions {
  activeDialog: ProjectDialogType | null;
  activeProject: Project | null;
  name: string;
  roomId: string;
  isLoading: boolean;
  error: string | null;
  setName: (name: string) => void;
  openCreate: () => void;
  openRename: (project: Project) => void;
  openDelete: (project: Project) => void;
  close: () => void;
  submitCreate: () => void;
  submitRename: () => void;
  submitDelete: () => void;
}

// Short, URL-safe suffix that keeps room IDs unique even when names collide.
function generateSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

// Pull a human-readable message from a failed API response, falling back to a
// generic message when the body has no usable `error` field.
async function readErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body?.error === "string" && body.error.length > 0) {
      return body.error;
    }
  } catch {
    // Ignore parse failures and use the fallback below.
  }
  return fallback;
}

export function useProjectActions(): UseProjectActions {
  const router = useRouter();
  const pathname = usePathname();

  const [activeDialog, setActiveDialog] = useState<ProjectDialogType | null>(
    null,
  );
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = slugify(name);
  const roomId = slug ? `${slug}-${suffix}` : "";

  const reset = useCallback(() => {
    setActiveDialog(null);
    setActiveProject(null);
    setName("");
    setError(null);
  }, []);

  const close = useCallback(() => {
    if (isLoading) {
      return;
    }
    reset();
  }, [isLoading, reset]);

  const openCreate = useCallback(() => {
    setActiveProject(null);
    setName("");
    setError(null);
    // Lock the suffix when the dialog opens so the previewed room ID matches
    // the one that is actually created on submit.
    setSuffix(generateSuffix());
    setActiveDialog("create");
  }, []);

  const openRename = useCallback((project: Project) => {
    setActiveProject(project);
    setName(project.name);
    setError(null);
    setActiveDialog("rename");
  }, []);

  const openDelete = useCallback((project: Project) => {
    setActiveProject(project);
    setName("");
    setError(null);
    setActiveDialog("delete");
  }, []);

  const submitCreate = useCallback(async () => {
    if (!roomId) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomId, name: name.trim() }),
      });

      if (!response.ok) {
        setError(
          await readErrorMessage(response, "Could not create the project."),
        );
        return;
      }

      const { project } = (await response.json()) as { project: { id: string } };
      reset();
      router.push(`/editor/${project.id}`);
    } catch {
      setError("Could not create the project. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [roomId, name, reset, router]);

  const submitRename = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed || !activeProject) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!response.ok) {
        setError(
          await readErrorMessage(response, "Could not rename the project."),
        );
        return;
      }

      reset();
      router.refresh();
    } catch {
      setError("Could not rename the project. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [name, activeProject, reset, router]);

  const submitDelete = useCallback(async () => {
    if (!activeProject) {
      return;
    }

    const target = activeProject;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${target.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError(
          await readErrorMessage(response, "Could not delete the project."),
        );
        return;
      }

      reset();
      if (pathname === `/editor/${target.id}`) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch {
      setError("Could not delete the project. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [activeProject, pathname, reset, router]);

  return {
    activeDialog,
    activeProject,
    name,
    roomId,
    isLoading,
    error,
    setName,
    openCreate,
    openRename,
    openDelete,
    close,
    submitCreate,
    submitRename,
    submitDelete,
  };
}
