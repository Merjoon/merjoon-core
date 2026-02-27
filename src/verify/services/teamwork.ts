import { getTeamworkService } from '../../teamwork/teamwork-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
  comments: ['tasks'],
};

export const service = getTeamworkService();
