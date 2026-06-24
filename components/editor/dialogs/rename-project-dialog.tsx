"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditorDialog } from "@/components/editor/editor-dialog";

interface RenameProjectDialogProps {
  open: boolean;
  name: string;
  currentName: string;
  isLoading: boolean;
  error: string | null;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export function RenameProjectDialog({
  open,
  name,
  currentName,
  isLoading,
  error,
  onNameChange,
  onOpenChange,
  onSubmit,
}: RenameProjectDialogProps) {
  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Rename project"
      description={`Currently named "${currentName}".`}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isLoading || !name.trim()}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </>
      }
    >
      <form
        className="flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Label htmlFor="rename-project-name">Project name</Label>
        <Input
          id="rename-project-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          autoFocus
          disabled={isLoading}
        />

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </form>
    </EditorDialog>
  );
}
