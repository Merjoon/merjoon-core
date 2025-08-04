import { getClickUpService } from '../../clickup/clickup-service';

export const config = {
  dependencies: {
    users: [],
    projects: [],
    tasks: [],
  },
};

export const service = getClickUpService();
