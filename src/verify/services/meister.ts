import { getMeisterService } from '../../meister/meister-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: [],
  },
};

export const service = getMeisterService();
