"use client";

import { useCallback, useState } from "react";

import { slugify } from "@/lib/slug";
import type { Project } from "@/types/project";

export type ProjectDialogType = "create" | "rename" | "delete";

interface UseProjectDialogs {
  activeDialog: ProjectDialogType | null;
  activeProject: Project | null;
  name: string;
  isLoading: boolean;
  setName: (name: string) => void;
  openCreate: () => void;
  openRename: (project: Project) => void;
  openDelete: (project: Project) => void;
  close: () => void;
  submitCreate: () => void;
  submitRename: () => void;
  submitDelete: () => void;
}

const SIMULATED_LATENCY_MS = 500;

export function useProjectDialogs(): UseProjectDialogs {
  const [activeDialog, setActiveDialog] = useState<ProjectDialogType | null>(
    null,
  );
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const close = useCallback(() => {
    if (isLoading) {
      return;
    }
    setActiveDialog(null);
    setActiveProject(null);
    setName("");
  }, [isLoading]);

  const openCreate = useCallback(() => {
    setActiveProject(null);
    setName("");
    setActiveDialog("create");
  }, []);

  const openRename = useCallback((project: Project) => {
    setActiveProject(project);
    setName(project.name);
    setActiveDialog("rename");
  }, []);

  const openDelete = useCallback((project: Project) => {
    setActiveProject(project);
    setName("");
    setActiveDialog("delete");
  }, []);

  // No persistence yet: simulate the loading lifecycle, then reset state.
  const runMockSubmit = useCallback(() => {
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setActiveDialog(null);
      setActiveProject(null);
      setName("");
    }, SIMULATED_LATENCY_MS);
  }, []);

  const submitCreate = useCallback(() => {
    // A name made only of non-slug characters trims to a non-empty string but
    // slugifies to "", so validate against the slug, not the raw name.
    if (!slugify(name)) {
      return;
    }
    runMockSubmit();
  }, [name, runMockSubmit]);

  const submitRename = useCallback(() => {
    if (!name.trim() || !activeProject) {
      return;
    }
    runMockSubmit();
  }, [name, activeProject, runMockSubmit]);

  const submitDelete = useCallback(() => {
    if (!activeProject) {
      return;
    }
    runMockSubmit();
  }, [activeProject, runMockSubmit]);

  return {
    activeDialog,
    activeProject,
    name,
    isLoading,
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
