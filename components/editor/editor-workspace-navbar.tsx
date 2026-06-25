"use client";

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

interface EditorWorkspaceNavbarProps {
  projectName: string;
  isSidebarOpen: boolean;
  isAiSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onToggleAiSidebar: () => void;
}

export function EditorWorkspaceNavbar({
  projectName,
  isSidebarOpen,
  isAiSidebarOpen,
  onToggleSidebar,
  onToggleAiSidebar,
}: EditorWorkspaceNavbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
        <span className="truncate text-sm font-medium text-foreground">
          {projectName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Share2 />
          Share
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleAiSidebar}
          aria-label={isAiSidebarOpen ? "Hide AI assistant" : "Show AI assistant"}
          aria-pressed={isAiSidebarOpen}
        >
          <Sparkles />
        </Button>
        <UserButton />
      </div>
    </header>
  );
}
