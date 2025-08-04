import { getTeamworkService } from '../../teamwork/teamwork-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: ['projects'],
  },
};

export const service = getTeamworkService();
