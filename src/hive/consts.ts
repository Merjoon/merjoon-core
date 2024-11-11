import { IMerjoonTransformConfig } from '../common/types';
import { HiveApiPath } from './types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'description',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("modifiedAt")',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'fullName',
    email_address: 'email',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'title',
    '[assignees]': 'UUID("assignees")',
    status: 'status',
    description: 'description',
    '[projects]': 'UUID("projectId")',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("modifiedAt")',
  },
};

export const HIVE_PATHS = {
  WORKSPACES: `${HiveApiPath.Workspaces}`,
  USERS: (id: string) => `${HiveApiPath.Workspaces}/${id}/${HiveApiPath.Users}`,
  PROJECTS: (id: string) => `${HiveApiPath.Workspaces}/${id}/${HiveApiPath.Projects}`,
  ACTIONS: (id: string) => `${HiveApiPath.Workspaces}/${id}/${HiveApiPath.Actions}`,
};
