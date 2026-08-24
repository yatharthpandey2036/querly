import type { Role } from "@/db/schema";

// A compact capability map mirroring the RBAC matrix in the product blueprint.
export const CAPABILITIES = {
  play_lessons: ["student"],
  view_own_progress: ["student", "super_admin"],
  view_child_progress: ["parent", "teacher", "super_admin"],
  grant_consent: ["parent", "super_admin"],
  manage_billing: ["parent", "school_admin", "super_admin"],
  create_class: ["teacher", "school_admin", "super_admin"],
  manage_roster: ["school_admin", "super_admin"],
  edit_content: ["author", "super_admin"],
  access_all_users: ["super_admin"],
} as const;

export type Capability = keyof typeof CAPABILITIES;

export function can(role: Role | undefined, cap: Capability): boolean {
  if (!role) return false;
  return (CAPABILITIES[cap] as readonly Role[]).includes(role);
}

export function homePathForRole(role: Role): string {
  switch (role) {
    case "parent":
      return "/parent";
    case "teacher":
    case "school_admin":
    case "author":
    case "super_admin":
      return "/learn"; // MVP: these roles land on learn; full dashboards are post-MVP.
    default:
      return "/learn";
  }
}
