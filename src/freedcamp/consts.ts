import { IMerjoonTransformConfig } from '../common/types';
import { FreedcampPath } from './types';

export const FREEDCAMP_PATH = {
  PROJECTS: FreedcampPath.Projects,
  USERS: FreedcampPath.Users,
  TASKS: FreedcampPath.Tasks,
};

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("project_id")',
    remote_id: 'project_id',
    name: 'project_name',
    remote_created_at: 'TIMESTAMP("created_ts", "$$second")',
    description: 'project_description',
  },
  users: {
    id: 'UUID("user_id")',
    remote_id: 'user_id',
    name: 'JOIN_STRINGS("first_name", "last_name", "$$ ")',
    email_address: 'email',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'title',
    '[assignees]': '[UUID("assigned_ids")]',
    status: 'status_title',
    description: 'description',
    '[projects]': 'UUID("project_id")',
    remote_created_at: 'TIMESTAMP("created_ts", "$$second")',
    remote_modified_at: 'TIMESTAMP("updated_ts", "$$second")',
    ticket_url: 'url',
  },
};
