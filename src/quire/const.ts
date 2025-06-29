import { QuireApiPath } from './types';
import { IMerjoonTransformConfig } from '../common/types';
export const QUIRE_PATHS = {
  PROJECTS: `${QuireApiPath.Project}/${QuireApiPath.List}`,
  USER: `${QuireApiPath.User}/${QuireApiPath.List}`,
  TASK: (oid: string) => `${QuireApiPath.Task}/${QuireApiPath.List}/${oid}`,
};

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    description: 'descriptionText',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("editedAt")',
  },

  users: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    email_address: 'email',
  },

  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    '[assignees]': '[assignees]->UUID("id")',
    status: 'status->name',
    description: 'descriptionText',
    '[projects]': 'UUID("projectId")',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("editedAt")',
    ticket_url: 'url',
  },
};
