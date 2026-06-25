import Link from "next/link";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card">
        <Lock className="size-7 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-medium text-foreground">
          You don&apos;t have access to this project
        </h1>
        <p className="text-sm text-muted-foreground">
          It may not exist, or you may not be the owner or a collaborator.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/editor">Back to projects</Link>
      </Button>
    </div>
  );
}
