import { getPlaneService } from '../../plane/plane-service';

export const dependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getPlaneService();
