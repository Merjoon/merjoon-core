import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'descriptionText',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("editedAt")',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    email_address: 'email',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    '[assignees]': '[assignees]->UUID("id")',
    status: 'status',
    description: 'descriptionText',
    '[projects]': '[project]->UUID("id")',
    remote_created_at: 'TIMESTAMP("createdAt")',
    remote_modified_at: 'TIMESTAMP("editedAt")',
    ticket_url: 'url',
  },
};