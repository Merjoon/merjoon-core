import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import {IWrikeUser, IWrikeTasks, IWrikeProject} from './types';
import {IMerjoonUsers, IMerjoonTasks, IMerjoonProjects} from '../common/types';

export class WrikeTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformUsers(data: IWrikeUser[]): IMerjoonUsers {
    return this.transform(data, this.config.users);
  }

  transformTasks(data: IWrikeTasks[]): IMerjoonTasks {
    return this.transform(data, this.config.tasks);
  }

  transformProjects(data: IWrikeProject[]): IMerjoonProjects {
    return this.transform(data, this.config.projects);
  }
}
