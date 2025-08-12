import { IMerjoonTransformConfig } from '../common/types';
import { TeamworkApiPath } from './types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    description: 'description',
    remote_created_at: 'TIMESTAMP("createdAt", "$$iso_string")',
    remote_modified_at: 'TIMESTAMP("updatedAt", "$$iso_string")',
  },

  users: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'JOIN_STRINGS("firstName", "lastName", "$$ ")',
    email_address: 'email',
    remote_created_at: 'TIMESTAMP("createdAt", "$$iso_string")',
    remote_modified_at: 'TIMESTAMP("updatedAt", "$$iso_string")',
  },

  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    '[assignees]': '[assigneeUsers]->UUID("id")',
    status: 'card->column->name',
    description: 'description',
    '[projects]': 'UUID("projectId")',
    remote_created_at: 'TIMESTAMP("createdAt", "$$iso_string")',
    remote_modified_at: 'TIMESTAMP("updatedAt", "$$iso_string")',
  },
};

export const TEAMWORK_PATHS = {
  PEOPLE: TeamworkApiPath.People,
  PROJECTS: TeamworkApiPath.Projects,
  TASKS: (projectId: number) => `${TeamworkApiPath.Projects}/${projectId}/${TeamworkApiPath.Tasks}`,
};
