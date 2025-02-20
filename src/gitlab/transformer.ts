import {MerjoonTransformer} from '../common/MerjoonTransformer';
import {TRANSFORM_CONFIG} from './consts';
import {IGitLabIssue,IGitLabProject,IGitLabMember} from './types';

export class GitLabTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformProjects(data:IGitLabProject[]){
    return this.transform(data,this.config.projects);
  }
  transformUsers(data:IGitLabMember[]){
    return this.transform(data,this.config.users);
  }
  transformIssues(data:IGitLabIssue[]){
    return this.transform(data,this.config.tasks);
  }
}
