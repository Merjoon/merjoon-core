import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IWrikeUser, IWrikeTask, IWrikeProject } from './types';
import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../common/types';

export class WrikeTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformUsers(data: IWrikeUser[]): IMerjoonUsers {
    return this.transform(data, this.config.users);
  }

  transformTasks(data: IWrikeTask[]): IMerjoonTasks {
    return this.transform(data, this.config.tasks);
  }

  transformProjects(data: IWrikeProject[]): IMerjoonProjects {
    return this.transform(data, this.config.projects);
  }
}
