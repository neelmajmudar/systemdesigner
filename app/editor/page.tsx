import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { EditorShell } from "@/components/editor/editor-shell";

export default async function EditorPage() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  return <EditorShell />;
}
