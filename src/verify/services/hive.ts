import { getHiveService } from '../../hive/hive-service';
import { EntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<EntityName> = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getHiveService();
