"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
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

        <TabsContent
          value="my-projects"
          className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border"
        >
          <p className="px-6 text-center text-sm text-muted-foreground">
            No projects yet
          </p>
        </TabsContent>

        <TabsContent
          value="shared"
          className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border"
        >
          <p className="px-6 text-center text-sm text-muted-foreground">
            Nothing shared with you yet
          </p>
        </TabsContent>
      </Tabs>

      <div className="border-t border-border p-3">
        <Button variant="outline" className="w-full">
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  );
}
