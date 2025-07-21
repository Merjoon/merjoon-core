import { getTeamworkService } from '../../teamwork/teamwork-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: [],
  },
};

export const service = getTeamworkService();
