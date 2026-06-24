import type { Project } from "@/types/project";

export const MOCK_OWNED_PROJECTS: Project[] = [
  { id: "p1", name: "Payments Platform", slug: "payments-platform", access: "owner" },
  { id: "p2", name: "Event Pipeline", slug: "event-pipeline", access: "owner" },
  { id: "p3", name: "Serverless API", slug: "serverless-api", access: "owner" },
];

export const MOCK_SHARED_PROJECTS: Project[] = [
  { id: "s1", name: "Team Microservices", slug: "team-microservices", access: "collaborator" },
];
