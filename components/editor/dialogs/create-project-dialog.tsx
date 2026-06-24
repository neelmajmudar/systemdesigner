"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorDialog } from "@/components/editor/editor-dialog";

interface CreateProjectDialogProps {
  open: boolean;
  name: string;
  roomId: string;
  isLoading: boolean;
  error: string | null;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export function CreateProjectDialog({
  open,
  name,
  roomId,
  isLoading,
  error,
  onNameChange,
  onOpenChange,
  onSubmit,
}: CreateProjectDialogProps) {
  const isInvalidName = name.trim().length > 0 && roomId.length === 0;

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create project"
      description="Start a new architecture workspace."
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading || !roomId}>
            {isLoading ? "Creating..." : "Create project"}
          </Button>
        </>
      }
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="create-project-name">Project name</Label>
          <Input
            id="create-project-name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="My architecture"
            autoFocus
            disabled={isLoading}
            aria-invalid={isInvalidName}
          />
          {isInvalidName ? (
            <p className="text-xs text-destructive">
              Use at least one letter or number.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Room ID preview</span>
          <code className="rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-sm text-foreground">
            {roomId || "your-project-name"}
          </code>
        </div>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </form>
    </EditorDialog>
  );
}
