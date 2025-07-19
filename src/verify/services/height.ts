import { getHeightService } from '../../height/height-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: [],
  },
};

export const service = getHeightService();
