import { getClickUpService } from '../../clickup/clickup-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  users: [],
  projects: ['users'],
  tasks: ['projects'],
  comments: ['tasks'],
};

export const service = getClickUpService();
