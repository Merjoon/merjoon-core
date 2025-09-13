import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import {
  IGithubIssuesMember,
  IGithubIssuesRepo,
  IGithubIssuesRepoIssue,
  IGithubIssuesTransformConfig,
} from './types';
import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../common/types';

export class GithubIssuesTransformer extends MerjoonTransformer<IGithubIssuesTransformConfig> {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformUsers(data: IGithubIssuesMember[]): IMerjoonUsers {
    return this.transform(data, this.config.users);
  }
  transformTasks(data: IGithubIssuesRepoIssue[]): IMerjoonTasks {
    return this.transform(data, this.config.tasks);
  }
  transformProjects(data: IGithubIssuesRepo[]): IMerjoonProjects {
    return this.transform(data, this.config.projects);
  }
}
