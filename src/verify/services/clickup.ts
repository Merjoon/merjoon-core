import { getClickUpService } from '../../clickup/clickup-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: [],
  },
};

export const service = getClickUpService();
