import { getFreedcampService } from '../../freedcamp/freedcamp-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getFreedcampService();
