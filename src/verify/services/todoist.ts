import { getTodoistService } from '../../todoist/todoist-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: ['projects'],
  tasks: [],
};

export const service = getTodoistService();
