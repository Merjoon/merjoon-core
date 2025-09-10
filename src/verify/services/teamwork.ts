import { getTeamworkService } from '../../teamwork/teamwork-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getTeamworkService();
