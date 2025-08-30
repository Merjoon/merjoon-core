import { getClickUpService } from '../../clickup/clickup-service';
import { EntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<EntityName> = {
  users: [],
  projects: ['users'],
  tasks: ['projects'],
};

export const service = getClickUpService();
