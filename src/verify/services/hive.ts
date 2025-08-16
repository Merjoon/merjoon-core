import { getHiveService } from '../../hive/hive-service';

export const dependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getHiveService();
