import { getClickUpService } from '../../clickup/clickup-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  users: [],
  projects: ['users'],
  tasks: ['projects'],
  comments: ['tasks'],
};

export const service = getClickUpService();
