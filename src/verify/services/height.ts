import { getHeightService } from '../../height/height-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getHeightService();
