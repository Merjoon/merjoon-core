import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { ITeamworkPeople, ITeamworkProject, ITeamworkTask } from './types';
import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { toRecordString } from '../utils/toRecordString';

export class TeamworkTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformPeople(data: ITeamworkPeople[]): IMerjoonUsers {
    return this.transform(data, toRecordString(this.config.users)) as IMerjoonUsers;
  }

  transformTasks(data: ITeamworkTask[]): IMerjoonTasks {
    return this.transform(data, toRecordString(this.config.tasks)) as IMerjoonTasks;
  }

  transformProjects(data: ITeamworkProject[]): IMerjoonProjects {
    return this.transform(data, toRecordString(this.config.projects)) as IMerjoonProjects;
  }
}
