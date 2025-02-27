import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IHiveUser, IHiveAction, IHiveProject } from './types';
import {
  IMerjoonUsers,
  IMerjoonTasks,
  IMerjoonProjects,
} from '../common/types';

export class HiveTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformUsers(data: IHiveUser[]): IMerjoonUsers {
    return this.transform(data, this.config.users);
  }

  transformActions(data: IHiveAction[]): IMerjoonTasks {
    return this.transform(data, this.config.tasks);
  }

  transformProjects(data: IHiveProject[]): IMerjoonProjects {
    return this.transform(data, this.config.projects);
  }
}
