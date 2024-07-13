import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_HEIGTH_CONFIG: IMerjoonTransformConfig = {
  collections: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'description',
    remote_created_at: 'createdAt',
    remote_modified_at: 'updatedAt',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'firstname',
    email_address: 'email',
    remote_created_at: 'createdAt',
    remote_modified_at: 'signedUpAt',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    '[assignees]': 'UUID("createdUserId")',
    status: 'status',
    description: 'description',
    '[collections]': 'UUID("listIds")',
    remote_created_at: 'createdAt',
    remote_updated_at: 'lastActivityAt',
    priority: 'priority',
  },
};
