import { getWrikeService } from '../../wrike/wrike-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: [],
  },
};

export const service = getWrikeService();
