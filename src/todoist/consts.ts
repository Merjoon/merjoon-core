import { TodoistApiPath } from './types';
import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'description',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    email_address: 'email',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'content',
    '[assignees]': 'UUID("assigned_by_uid")',
    status: 'section->name',
    description: 'description',
    remote_created_at: 'TIMESTAMP("added_at", "$$iso")',
    remote_modified_at: 'TIMESTAMP("updated_at", "$$iso")',
    '[projects]': 'UUID("project_id")',
  },
};

export const TODOIST_PATHS = {
  PROJECTS: TodoistApiPath.Projects,
  COLLABORATORS: (projectId: string) =>
    `${TodoistApiPath.Projects}/${projectId}/${TodoistApiPath.Collaborators}`,
  TASKS: TodoistApiPath.Tasks,
  SECTIONS: TodoistApiPath.Sections,
};
