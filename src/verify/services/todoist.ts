import { getTodoistService } from '../../todoist/todoist-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: ['projects'],
  tasks: [],
};

export const service = getTodoistService();
