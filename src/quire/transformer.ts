import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './const';
import { IQuireUser, IQuireTask, IQuireProject } from './types';
import { IMerjoonUsers, IMerjoonTasks, IMerjoonProjects } from '../common/types';
import { toRecordString } from '../utils/toRecordString';

export class QuireTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformProjects(data: IQuireProject[]): IMerjoonProjects {
    return this.transform(data, toRecordString(this.config.projects)) as IMerjoonProjects;
  }

  transformTasks(data: IQuireTask[]): IMerjoonTasks {
    return this.transform(data, toRecordString(this.config.tasks)) as IMerjoonTasks;
  }

  transformUsers(data: IQuireUser[]): IMerjoonUsers {
    return this.transform(data, toRecordString(this.config.users)) as IMerjoonUsers;
  }
}
