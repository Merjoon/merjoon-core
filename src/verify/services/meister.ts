import { getMeisterService } from '../../meister/meister-service';

export const dependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getMeisterService();
