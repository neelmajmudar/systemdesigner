import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { EditorShell } from "@/components/editor/editor-shell";
import { getProjectsForUser } from "@/lib/projects";

export default async function EditorPage() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  const { owned, shared } = await getProjectsForUser();

  return <EditorShell ownedProjects={owned} sharedProjects={shared} />;
}
