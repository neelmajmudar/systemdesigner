"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorHomeProps {
  onCreateProject: () => void;
}

export function EditorHome({ onCreateProject }: EditorHomeProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-medium text-foreground">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-muted-foreground">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>
      </div>
      <Button onClick={onCreateProject}>
        <Plus />
        New Project
      </Button>
    </div>
  );
}
