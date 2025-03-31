import { IMerjoonTransformConfig } from '../common/types';
import { WrikeApiPath } from './types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'title',
    description: 'description',
    remote_created_at: 'TIMESTAMP("createdDate")',
    remote_modified_at: 'TIMESTAMP("updatedDate")',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'JOIN_STRINGS("firstName", "lastName", "$$ ")',
    email_address: 'primaryEmail',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'title',
    '[assignees]': '[UUID("responsibleIds")]',
    status: 'status',
    description: 'description',
    '[projects]': 'UUID("parentIds")',
    remote_created_at: 'TIMESTAMP("createdDate")',
    remote_modified_at: 'TIMESTAMP("updatedDate")',
    ticket_url: 'permalink',
  },
};

export const WRIKE_PATHS = {
  CONTACTS: WrikeApiPath.Contacts,
  PROJECTS: WrikeApiPath.Projects,
  TASKS: WrikeApiPath.Tasks,
};
