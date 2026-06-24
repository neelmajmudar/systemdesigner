import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const DEFAULT_PROJECT_NAME = "Untitled Project";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { name?: unknown; id?: unknown }
    | null;

  const rawName = typeof body?.name === "string" ? body.name.trim() : "";
  const name = rawName.length > 0 ? rawName : DEFAULT_PROJECT_NAME;

  // Optional client-supplied ID keeps the project ID aligned with the
  // Liveblocks room ID; absent it, the schema's cuid default applies.
  const rawId = typeof body?.id === "string" ? body.id.trim() : "";

  try {
    const project = await prisma.project.create({
      data: { name, ownerId: userId, ...(rawId.length > 0 ? { id: rawId } : {}) },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    // A client-supplied room ID can collide on a double submit or retry.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A project with this ID already exists" },
        { status: 409 },
      );
    }

    throw error;
  }
}
