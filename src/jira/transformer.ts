import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IJiraIssue, IJiraProject, IJiraTransformConfig, IJiraUser } from './types';

export class JiraTransformer extends MerjoonTransformer<IJiraTransformConfig> {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformUsers(data: IJiraUser[]) {
    return this.transform(data, this.config.users);
  }
  transformIssues(data: IJiraIssue[]) {
    return this.transform(data, this.config.tasks);
  }
  transformProjects(data: IJiraProject[]) {
    return this.transform(data, this.config.projects);
  }
}
