import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'description',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("updatedAt")',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'username',
    email_address: 'email',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("createdAt")',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    '[assignees]': '[assigneesIds]',
    status: 'status',
    description: 'description',
    '[projects]': 'UUID("listIds")',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("lastActivityAt")',
    ticket_url: 'url',
  },
};
