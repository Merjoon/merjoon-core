import { getTodoistService } from '../../todoist/todoist-service';
import { BaseEntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<BaseEntityName> = {
  projects: [],
  users: ['projects'],
  tasks: [],
};

export const service = getTodoistService();
