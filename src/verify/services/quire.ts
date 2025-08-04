import { getQuireService } from '../../quire/quire-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: ['projects'],
  },
};

export const service = getQuireService();
