import { getPlaneService } from '../../plane/plane-service';
import { BaseEntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<BaseEntityName> = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getPlaneService();
