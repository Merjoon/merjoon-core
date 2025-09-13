import { getMeisterService } from '../../meister/meister-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getMeisterService();
