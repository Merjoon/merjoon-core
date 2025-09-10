import { getFreedcampService } from '../../freedcamp/freedcamp-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getFreedcampService();
