import { getQuireService } from '../../quire/quire-service';

export const dependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getQuireService();
