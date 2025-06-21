import { TodoistApiPath } from './types';

export const TODOIST_PATHS = {
  PROJECTS: TodoistApiPath.Projects,
  USERS: (projectId: string) => `${TodoistApiPath.Projects}/${projectId}/${TodoistApiPath.Users}`,
};
