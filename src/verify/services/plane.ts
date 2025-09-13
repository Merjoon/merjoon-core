import { getPlaneService } from '../../plane/plane-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getPlaneService();
