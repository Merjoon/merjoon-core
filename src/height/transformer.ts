import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IHeightList, IHeightTask, IHeightUser } from './types';
import { IMerjoonUsers, IMerjoonTasks, IMerjoonProjects } from '../common/types';
import { toRecordString } from '../utils/toRecordString';

export class HeightTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformUsers(data: IHeightUser[]): IMerjoonUsers {
    return this.transform(data, toRecordString(this.config.users)) as IMerjoonUsers;
  }

  transformTasks(data: IHeightTask[]): IMerjoonTasks {
    return this.transform(data, toRecordString(this.config.tasks)) as IMerjoonTasks;
  }

  transformLists(data: IHeightList[]): IMerjoonProjects {
    return this.transform(data, toRecordString(this.config.projects)) as IMerjoonProjects;
  }
}
