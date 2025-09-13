import { getQuireService } from '../../quire/quire-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getQuireService();
