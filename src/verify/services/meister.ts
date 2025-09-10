import { getMeisterService } from '../../meister/meister-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getMeisterService();
