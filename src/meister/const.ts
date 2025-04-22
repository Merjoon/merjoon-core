import { MeisterPath } from './type';
import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    description: 'notes',
    remote_created_at: 'TIMESTAMP("created_at")',
    remote_modified_at: 'TIMESTAMP("updated_at")',
  },

  users: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'JOIN_STRINGS("firstname", "lastname", "$$ ")',
    email_address: 'email',
    remote_created_at: 'TIMESTAMP("created_at")',
    remote_modified_at: 'TIMESTAMP("updated_at")',
  },

  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    '[assignees]': 'UUID("assigned_to_id")',
    status: 'section_name',
    description: 'notes',
    '[projects]': 'UUID("project_id")',
    remote_created_at: 'TIMESTAMP("created_at")',
    remote_modified_at: 'TIMESTAMP("updated_at")',
  },
};

export const MEISTER_PATH = {
  TASKS: MeisterPath.Tasks,
  PROJECTS: MeisterPath.Projects,
  PERSONS: MeisterPath.Persons,
};
