import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface ProjectIdentity {
  userId: string;
  email: string | null;
}

/**
 * Resolve the current Clerk identity: the user ID plus the primary email used
 * for collaborator matching. Returns `null` when no user is authenticated.
 */
export async function getCurrentIdentity(): Promise<ProjectIdentity | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  return { userId, email };
}

/**
 * Load a project the given identity is allowed to open. Access is granted to
 * the owner or to a collaborator whose email matches. Returns `null` when the
 * project does not exist or the identity has no access.
 */
export async function getAccessibleProject(
  projectId: string,
  identity: ProjectIdentity,
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  });

  if (!project) {
    return null;
  }

  const isOwner = project.ownerId === identity.userId;
  const isCollaborator =
    identity.email !== null &&
    project.collaborators.some(
      (collaborator) => collaborator.email === identity.email,
    );

  if (!isOwner && !isCollaborator) {
    return null;
  }

  return project;
}
