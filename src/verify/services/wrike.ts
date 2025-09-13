import { getWrikeService } from '../../wrike/wrike-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getWrikeService();
