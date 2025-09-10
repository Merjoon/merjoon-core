import { getPlaneService } from '../../plane/plane-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getPlaneService();
