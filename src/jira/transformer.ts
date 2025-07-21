import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IJiraIssue, IJiraProject, IJiraUser } from './types';
import { toRecordString } from '../utils/toRecordString';
import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../common/types';

export class JiraTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformUsers(data: IJiraUser[]) {
    return this.transform(data, toRecordString(this.config.users)) as IMerjoonUsers;
  }
  transformIssues(data: IJiraIssue[]) {
    return this.transform(data, toRecordString(this.config.tasks)) as IMerjoonTasks;
  }
  transformProjects(data: IJiraProject[]) {
    return this.transform(data, toRecordString(this.config.projects)) as IMerjoonProjects;
  }
}
