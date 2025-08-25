import { PlaneApiPath } from './types';
import { IMerjoonTransformConfig } from '../common/types';

export const PLANE_PATH = {
  PROJECTS: PlaneApiPath.Projects,
  ISSUES: (projectId: string) => `${PlaneApiPath.Projects}/${projectId}/${PlaneApiPath.Issues}`,
  MEMBERS: PlaneApiPath.Members,
};

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    remote_created_at: 'TIMESTAMP("created_at", "$$iso")',
    remote_modified_at: 'TIMESTAMP("updated_at", "$$iso")',
    name: 'name',
    description: 'description',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'display_name',
    email_address: 'email',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    '[assignees]': '[UUID("assignees")]',
    status: 'state->name',
    description: 'HTML_TO_STRING("description_html")',
    '[projects]': 'UUID("project")',
    remote_created_at: 'TIMESTAMP("created_at", "$$iso")',
    remote_modified_at: 'TIMESTAMP("updated_at", "$$iso")',
  },
};
