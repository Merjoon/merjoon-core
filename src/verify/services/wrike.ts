import { getWrikeService } from '../../wrike/wrike-service';

export const dependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getWrikeService();
