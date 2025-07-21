import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './const';
import { IMeisterPerson, IMeisterProject, IMeisterTask } from './type';
import { IMerjoonUsers, IMerjoonTasks, IMerjoonProjects } from '../common/types';
import { toRecordString } from '../utils/toRecordString';

export class MeisterTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformProjects(data: IMeisterProject[]): IMerjoonProjects {
    return this.transform(data, toRecordString(this.config.projects)) as IMerjoonProjects;
  }

  transformTasks(data: IMeisterTask[]): IMerjoonTasks {
    return this.transform(data, toRecordString(this.config.tasks)) as IMerjoonTasks;
  }

  transformPersons(data: IMeisterPerson[]): IMerjoonUsers {
    return this.transform(data, toRecordString(this.config.users)) as IMerjoonUsers;
  }
}
