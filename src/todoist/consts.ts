import { IMerjoonTransformConfig } from '../common/types';
import { TodoistApiPath } from './types';
/* Using @ts-ignore because IMerjoonTransformConfig includes users and tasks fields
which are not yet implemented. The current implementation focuses only on projects logic.*/

// @ts-expect-error IMerjoonTransformConfig includes unused keys like 'users' and 'tasks'
export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'description',
  },
};

export const TODOIST_PATHS = {
  PROJECTS: TodoistApiPath.Projects,
  TASKS: null,
  USERS: null,
};
