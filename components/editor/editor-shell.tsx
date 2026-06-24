"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { EditorHome } from "@/components/editor/editor-home";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";
import { cn } from "@/lib/utils";

export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dialogs = useProjectDialogs();

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      dialogs.close();
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-background">
        <EditorHome onCreateProject={dialogs.openCreate} />

        <div
          aria-hidden
          onClick={() => setIsSidebarOpen(false)}
          className={cn(
            "absolute inset-0 z-30 bg-black/50 backdrop-blur-xs transition-opacity md:hidden",
            isSidebarOpen
              ? "opacity-100"
              : "pointer-events-none opacity-0",
          )}
        />

        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCreate={dialogs.openCreate}
          onRename={dialogs.openRename}
          onDelete={dialogs.openDelete}
        />
      </div>

      <CreateProjectDialog
        open={dialogs.activeDialog === "create"}
        name={dialogs.name}
        isLoading={dialogs.isLoading}
        onNameChange={dialogs.setName}
        onOpenChange={handleDialogOpenChange}
        onSubmit={dialogs.submitCreate}
      />

      <RenameProjectDialog
        open={dialogs.activeDialog === "rename"}
        name={dialogs.name}
        currentName={dialogs.activeProject?.name ?? ""}
        isLoading={dialogs.isLoading}
        onNameChange={dialogs.setName}
        onOpenChange={handleDialogOpenChange}
        onSubmit={dialogs.submitRename}
      />

      <DeleteProjectDialog
        open={dialogs.activeDialog === "delete"}
        projectName={dialogs.activeProject?.name ?? ""}
        isLoading={dialogs.isLoading}
        onOpenChange={handleDialogOpenChange}
        onConfirm={dialogs.submitDelete}
      />
    </div>
  );
}
