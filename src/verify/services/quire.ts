import { getQuireService } from '../../quire/quire-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getQuireService();
