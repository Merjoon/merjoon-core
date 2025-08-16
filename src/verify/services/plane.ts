import { getPlaneService } from '../../plane/plane-service';
export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: ['projects'],
  },
};
export const service = getPlaneService();
