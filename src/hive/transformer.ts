import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IHiveUser, IHiveAction, IHiveProject } from './types';
import { IMerjoonUsers, IMerjoonTasks, IMerjoonProjects } from '../common/types';
import { toRecordString } from '../utils/toRecordString';

export class HiveTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformUsers(data: IHiveUser[]): IMerjoonUsers {
    return this.transform(data, toRecordString(this.config.users)) as IMerjoonUsers;
  }

  transformActions(data: IHiveAction[]): IMerjoonTasks {
    return this.transform(data, toRecordString(this.config.tasks)) as IMerjoonTasks;
  }

  transformProjects(data: IHiveProject[]): IMerjoonProjects {
    return this.transform(data, toRecordString(this.config.projects)) as IMerjoonProjects;
  }
}
