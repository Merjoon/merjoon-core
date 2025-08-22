import { getTeamworkService } from '../../teamwork/teamwork-service';

export const dependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getTeamworkService();
