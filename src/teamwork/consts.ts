import { IMerjoonTransformConfig } from '../common/types';
import {TeamworkApiPath} from './types';

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
    name: 'full-name',
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
    '[projects]': '[projects]->UUID("id")',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("updatedAt")',
  },
};

export const Teamwork_PATHS = {
  USERS: TeamworkApiPath.People,
  PROJECTS: TeamworkApiPath.Projects,
  TASKS: (projectId: string) => `${TeamworkApiPath.Projects}/${projectId}/${TeamworkApiPath.Tasks}`,
};
