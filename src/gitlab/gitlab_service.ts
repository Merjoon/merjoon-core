import {GitLab} from './api';
import {GitLabService} from './service';
import {GitLabTransformer} from './transformer';
import {IGitLabConfig , IGitLabConfigHttpsAgent} from './types';
// import {JiraService} from "../jira/service";

export function getGitLabService(): GitLabService{
  const {
    GITLAB_TOKEN,
    LIMIT,
    HTTP_AGENT,
  } = process.env;
  if(!GITLAB_TOKEN || !LIMIT || !HTTP_AGENT){
    throw new Error('Missing necessary environment variables');
  }
  const httpAgent:IGitLabConfigHttpsAgent={
    maxSockets:Number(HTTP_AGENT),
  };
  const config: IGitLabConfig = {
    token: GITLAB_TOKEN,
    limit:Number(LIMIT),
    httpsAgent:httpAgent
  };
  const api:GitLab = new GitLab(config);
  const transformer: GitLabTransformer = new GitLabTransformer();
  return new GitLabService(api,transformer);
}
