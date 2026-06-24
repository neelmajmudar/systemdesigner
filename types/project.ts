export type ProjectAccess = "owner" | "collaborator";

export interface Project {
  id: string;
  name: string;
  slug: string;
  access: ProjectAccess;
}
