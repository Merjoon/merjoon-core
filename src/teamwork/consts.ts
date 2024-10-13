import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'description',
    remote_created_at: 'Timestamp("created-on")',
    remote_modified_at: 'Timestamp("last-changed-on")',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'full-name',
    email_address: 'email-address',
    remote_created_at: 'Timestamp("created-at")',
    remote_modified_at: 'Timestamp("last-changed-on")',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'content',
    '[assignees]': '[assignees]->UUID("id")',
    status: 'boardColumn->name',
    description: 'description',
    '[projects]': 'UUID("project-id")',
    remote_created_at: 'Timestamp("created-on")',
    remote_modified_at: 'Timestamp("last-changed-on")',
  },
}
