import { getMeisterService } from '../../meister/meister-service';
import { BaseEntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<BaseEntityName> = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getMeisterService();
