import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { EditorWorkspace } from "@/components/editor/editor-workspace";
import { getAccessibleProject, getCurrentIdentity } from "@/lib/project-access";
import { getProjectsForUser } from "@/lib/projects";

interface EditorRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const { roomId } = await params;

  const identity = await getCurrentIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const project = await getAccessibleProject(roomId, identity);

  if (!project) {
    return <AccessDenied />;
  }

  const { owned, shared } = await getProjectsForUser();

  return (
    <EditorWorkspace
      roomId={roomId}
      projectName={project.name}
      ownedProjects={owned}
      sharedProjects={shared}
    />
  );
}
