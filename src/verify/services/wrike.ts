import { getWrikeService } from '../../wrike/wrike-service';
import { BaseEntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<BaseEntityName> = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getWrikeService();
