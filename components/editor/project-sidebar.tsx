"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectListItem } from "@/components/editor/project-list-item";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectSidebarProps {
  isOpen: boolean;
  owned: Project[];
  shared: Project[];
  activeProjectId?: string;
  onClose: () => void;
  onCreate: () => void;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectSidebar({
  isOpen,
  owned,
  shared,
  activeProjectId,
  onClose,
  onCreate,
  onRename,
  onDelete,
}: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "absolute inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-card/95 backdrop-blur-sm transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-medium text-foreground">Projects</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close projects sidebar"
        >
          <X />
        </Button>
      </div>

      <Tabs
        defaultValue="my-projects"
        className="flex flex-1 flex-col gap-3 overflow-hidden p-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects" className="flex-1 overflow-hidden">
          {owned.length > 0 ? (
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-1 pr-2">
                {owned.map((project) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    isActive={project.id === activeProjectId}
                    onRename={onRename}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border">
              <p className="px-6 text-center text-sm text-muted-foreground">
                No projects yet
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared" className="flex-1 overflow-hidden">
          {shared.length > 0 ? (
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-1 pr-2">
                {shared.map((project) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    isActive={project.id === activeProjectId}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border">
              <p className="px-6 text-center text-sm text-muted-foreground">
                Nothing shared with you yet
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="border-t border-border p-3">
        <Button variant="outline" className="w-full" onClick={onCreate}>
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  );
}
