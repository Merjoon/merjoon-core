import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'description',
    remote_created_at: 'created-on',
    remote_modified_at: 'last-changed-on',
  },
  users: {
    id: '',
    remote_id: '',
    name: '',
    email_address: '',
    remote_created_at: '',
    remote_modified_at: '',
  },
  tasks: {
    id: '',
    remote_id: '',
    name: '',
    '[assignees]': '',
    status: '',
    description: '',
    '[projects]': '',
    remote_created_at: '',
    remote_modified_at: '',
  },
}