import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    created_at:'createdAt',
    modified_at:'updatedAt',
    remote_id: 'STRING("id")',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("updatedAt")',
    name: 'name',
    description: 'description',
  },

  users: {
    id: 'UUID("id")',
    created_at:'createdAt',
    modified_at:'updatedAt',
    remote_id: 'STRING("id")',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("updatedAt")',
    name: 'STRING("firstName") + STRING(" ") + STRING("lastName")',
    email_address: 'email',

  },

  tasks: {
    id: 'UUID("id")',
    created_at:'createdAt',
    modified_at:'updatedAt',
    remote_id: 'STRING("id")',
    name: 'name',
    '[assignees]': '[assigneeUsers]->UUID("id")',
    status: 'status',
    description: 'description',
    '[projects]': '[project]->UUID("id")',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("updatedAt")',
    ticket_url: '-',
  },
};
