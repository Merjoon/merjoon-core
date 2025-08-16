import { getTodoistService } from '../../todoist/todoist-service';

export const dependencies = {
  projects: [],
  users: ['projects'],
  tasks: [],
};

export const service = getTodoistService();
