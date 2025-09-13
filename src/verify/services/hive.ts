import { getHiveService } from '../../hive/hive-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getHiveService();
