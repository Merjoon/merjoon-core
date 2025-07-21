import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IClickUpMembers, IClickUpTasks, IClickUpLists } from './types';
import { IMerjoonUsers, IMerjoonTasks, IMerjoonProjects } from '../common/types';
import { toRecordString } from '../utils/toRecordString';

export class ClickUpTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformMembers(data: IClickUpMembers): IMerjoonUsers {
    return this.transform(data, toRecordString(this.config.users)) as IMerjoonUsers;
  }

  transformTasks(data: IClickUpTasks): IMerjoonTasks {
    return this.transform(data, toRecordString(this.config.tasks)) as IMerjoonTasks;
  }

  transformLists(data: IClickUpLists): IMerjoonProjects {
    return this.transform(data, toRecordString(this.config.projects)) as IMerjoonProjects;
  }
}
