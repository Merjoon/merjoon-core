import { getWrikeService } from '../../wrike/wrike-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getWrikeService();
