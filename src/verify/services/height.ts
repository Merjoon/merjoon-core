import { getHeightService } from '../../height/height-service';
import { BaseEntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<BaseEntityName> = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getHeightService();
