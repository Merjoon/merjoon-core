import { IMerjoonTransformConfig } from "../common/types";

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: "id",
    name: "name",
    description: "description",
    remote_created_at: "createdAt",
    remote_modified_at: "updatedAt",
  },
  users: {
    id: 'UUID("id")',
    remote_id: "id",
    name: "username",
    email_address: "email",
    remote_created_at: "createdAt",
    remote_modified_at: "signedUpAt",
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: "name",
    "[assignees]": '[assignees]->UUID("id")',
    status: "boardColumn->name",
    description: "description",
    "[projects]": 'UUID("project-id")',
    remote_created_at: "created-on",
    remote_modified_at: "last-changed-on",
  },
};
