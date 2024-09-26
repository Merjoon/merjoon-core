import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'description',
    remote_created_at: 'createdAt',
    remote_modified_at: 'modifiedAt',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'fullName',
    email_address: 'email',
    remote_created_at: '', // not found 
    remote_modified_at: '', // not found
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'title',
    '[assignees]': 'UUID("assignees")',
    status: 'status',
    description: 'description',
    '[projects]': 'UUID("projectId")',
    remote_created_at: 'createdAt',
    remote_updated_at: 'modifiedAt',
  },
}
