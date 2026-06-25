"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { EditorWorkspaceNavbar } from "@/components/editor/editor-workspace-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface EditorWorkspaceProps {
  roomId: string;
  projectName: string;
  ownedProjects: Project[];
  sharedProjects: Project[];
}

export function EditorWorkspace({
  roomId,
  projectName,
  ownedProjects,
  sharedProjects,
}: EditorWorkspaceProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const dialogs = useProjectActions();

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      dialogs.close();
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <EditorWorkspaceNavbar
        projectName={projectName}
        isSidebarOpen={isSidebarOpen}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        onToggleAiSidebar={() => setIsAiSidebarOpen((open) => !open)}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <main className="flex flex-1 items-center justify-center bg-background px-6 text-center">
          <p className="text-sm text-muted-foreground">
            The collaborative canvas will appear here.
          </p>
        </main>

        <div
          aria-hidden
          onClick={() => setIsSidebarOpen(false)}
          className={cn(
            "absolute inset-0 z-30 bg-black/50 backdrop-blur-xs transition-opacity md:hidden",
            isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />

        <ProjectSidebar
          isOpen={isSidebarOpen}
          owned={ownedProjects}
          shared={sharedProjects}
          activeProjectId={roomId}
          onClose={() => setIsSidebarOpen(false)}
          onCreate={dialogs.openCreate}
          onRename={dialogs.openRename}
          onDelete={dialogs.openDelete}
        />

        <aside
          aria-hidden={!isAiSidebarOpen}
          className={cn(
            "absolute inset-y-0 right-0 z-40 flex w-80 flex-col border-l border-border bg-card/95 backdrop-blur-sm transition-transform duration-200 ease-in-out",
            isAiSidebarOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
            <Sparkles className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-foreground">AI Assistant</h2>
          </div>
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <p className="text-sm text-muted-foreground">
              AI chat will live here.
            </p>
          </div>
        </aside>
      </div>

      <CreateProjectDialog
        open={dialogs.activeDialog === "create"}
        name={dialogs.name}
        roomId={dialogs.roomId}
        isLoading={dialogs.isLoading}
        error={dialogs.error}
        onNameChange={dialogs.setName}
        onOpenChange={handleDialogOpenChange}
        onSubmit={dialogs.submitCreate}
      />

      <RenameProjectDialog
        open={dialogs.activeDialog === "rename"}
        name={dialogs.name}
        currentName={dialogs.activeProject?.name ?? ""}
        isLoading={dialogs.isLoading}
        error={dialogs.error}
        onNameChange={dialogs.setName}
        onOpenChange={handleDialogOpenChange}
        onSubmit={dialogs.submitRename}
      />

      <DeleteProjectDialog
        open={dialogs.activeDialog === "delete"}
        projectName={dialogs.activeProject?.name ?? ""}
        isLoading={dialogs.isLoading}
        error={dialogs.error}
        onOpenChange={handleDialogOpenChange}
        onConfirm={dialogs.submitDelete}
      />
    </div>
  );
}
