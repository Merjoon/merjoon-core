import { IMerjoonTransformConfig } from '../common/types';
import { HiveApiPath, HiveApiVersion } from './types';

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
  WORKSPACES: `${HiveApiVersion.V1}/${HiveApiPath.Workspaces}`,
  USERS: (id: string) => `${HiveApiVersion.V1}/${HiveApiPath.Workspaces}/${id}/${HiveApiPath.Users}`,
  PROJECTS: (id: string) => `${HiveApiVersion.V2}/${HiveApiPath.Workspaces}/${id}/${HiveApiPath.Projects}`,
  ACTIONS: (id: string) => `${HiveApiVersion.V2}/${HiveApiPath.Workspaces}/${id}/${HiveApiPath.Actions}`,
};
