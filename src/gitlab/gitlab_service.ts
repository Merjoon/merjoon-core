import {GitLab} from './api';
import {GitLabService} from './service';
import {GitLabTransformer} from './transformer';
import {IGitLabConfig} from './types';

export function getGitLabService(): GitLabService{
  const {
    GITLAB_TOKEN,
    GITLAB_LIMIT,
    GITLAB_HTTP_AGENT,
    GITLAB_USE_HTTP_AGENT
  } = process.env;
  if(!GITLAB_TOKEN){
    throw new Error('Missing necessary environment variables');
  }
  const config: IGitLabConfig = {
    token: GITLAB_TOKEN,
    limit:Number(GITLAB_LIMIT),
  };
  if(GITLAB_USE_HTTP_AGENT === 'true'){
    config.httpsAgent={
      maxSockets:Number(GITLAB_HTTP_AGENT),
    };
  }
  const api:GitLab = new GitLab(config);
  const transformer: GitLabTransformer = new GitLabTransformer();
  return new GitLabService(api,transformer);
}
