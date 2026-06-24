import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import type { Project, ProjectAccess } from "@/types/project";

function toProject(
  record: { id: string; name: string },
  access: ProjectAccess,
): Project {
  // The project ID is the Liveblocks room ID (slug + suffix), so it doubles as
  // the human-readable slug shown in the sidebar.
  return { id: record.id, name: record.name, slug: record.id, access };
}

export async function getProjectsForUser(): Promise<{
  owned: Project[];
  shared: Project[];
}> {
  const { userId } = await auth();

  if (!userId) {
    return { owned: [], shared: [] };
  }

  const ownedRecords = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  const sharedRecords = email
    ? await prisma.project.findMany({
        where: {
          ownerId: { not: userId },
          collaborators: { some: { email } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return {
    owned: ownedRecords.map((record) => toProject(record, "owner")),
    shared: sharedRecords.map((record) => toProject(record, "collaborator")),
  };
}
