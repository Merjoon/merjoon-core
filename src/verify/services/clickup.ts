import { getClickUpService } from '../../clickup/clickup-service';

export const config = {
  dependencies: {
    users: [],
    projects: ['users'],
    tasks: ['projects'],
  },
};

export const service = getClickUpService();
