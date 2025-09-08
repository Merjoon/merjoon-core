import { getPlaneService } from '../../plane/plane-service';
import { EntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<EntityName> = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getPlaneService();
