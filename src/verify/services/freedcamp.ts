import { getFreedcampService } from '../../freedcamp/freedcamp-service';
export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: [],
  },
};
export const service = getFreedcampService();
