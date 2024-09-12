import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  collections: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'description',
    remote_created_at: 'created-on',
    remote_modified_at: 'last-changed-on',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'full-name',
    email_address: 'email-address',
    remote_created_at: 'created-at',
    remote_modified_at: 'last-changed-on',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'content',
    '[assignees]': 'UUID("creator-id")',
    status: 'boardColumn->name',
    description: 'description',
    '[projects]': 'UUID("project-id")',
    remote_created_at: 'created-on',
    remote_updated_at: 'last-changed-on',
    priority: 'priority',
  },
}
