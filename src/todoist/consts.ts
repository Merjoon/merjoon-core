import { TodoistApiPath } from './types';

export const TODOIST_PATHS = {
  PROJECTS: TodoistApiPath.Projects,
  COLLABORATORS: (projectId: string) =>
    `${TodoistApiPath.Projects}/${projectId}/${TodoistApiPath.Collaborators}`,
  TASKS: TodoistApiPath.Tasks,
};
