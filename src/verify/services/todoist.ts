import { getTodoistService } from '../../todoist/todoist-service';

export const config = {
  dependencies: {
    projects: [],
    users: ['projects'],
    tasks: [],
  },
};

export const service = getTodoistService();
