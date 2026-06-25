"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectListItemProps {
  project: Project;
  isActive?: boolean;
  onRename?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectListItem({
  project,
  isActive = false,
  onRename,
  onDelete,
}: ProjectListItemProps) {
  const showActions = project.access === "owner" && (onRename || onDelete);

  return (
    <div
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-2 rounded-xl px-2.5 py-2 hover:bg-muted/50",
        isActive && "bg-muted",
      )}
    >
      <Link
        href={`/editor/${project.id}`}
        className="flex min-w-0 flex-1 flex-col rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          className={cn(
            "truncate text-sm text-foreground",
            isActive && "text-primary",
          )}
        >
          {project.name}
        </span>
        <span className="truncate font-mono text-xs text-muted-foreground">
          {project.slug}
        </span>
      </Link>

      {showActions ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              aria-label={`Actions for ${project.name}`}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onRename ? (
              <DropdownMenuItem onSelect={() => onRename(project)}>
                <Pencil />
                Rename
              </DropdownMenuItem>
            ) : null}
            {onDelete ? (
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onDelete(project)}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
