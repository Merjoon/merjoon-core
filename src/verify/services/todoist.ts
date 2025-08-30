import { getTodoistService } from '../../todoist/todoist-service';
import { EntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<EntityName> = {
  projects: [],
  users: ['projects'],
  tasks: [],
};

export const service = getTodoistService();
