import { getHiveService } from '../../hive/hive-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: [],
  },
};

export const service = getHiveService();
