import { IMerjoonTransformConfig } from '../common/types';
import { TeamworkApiPath } from './types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    description: 'description',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("updatedAt")',
  },

  users: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'fullName',
    email_address: 'email',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("updatedAt")',

  },

  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    '[assignees]': '[assigneeUsers]->UUID("id")',
    status: 'status',
    description: 'description',
    '[projects]': 'UUID("projectId")',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("updatedAt")',
  },
};

export const TEAMWORK_PATHS = {
  USERS: TeamworkApiPath.People,
  PROJECTS: TeamworkApiPath.Projects,
  TASKS: (projectId: number) => `${TeamworkApiPath.Projects}/${projectId}/${TeamworkApiPath.Tasks}`,
};
