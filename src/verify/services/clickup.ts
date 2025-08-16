import { getClickUpService } from '../../clickup/clickup-service';

export const dependencies = {
  users: [],
  projects: ['users'],
  tasks: ['projects'],
};

export const service = getClickUpService();
