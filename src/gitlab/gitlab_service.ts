import { GitLab } from './api';
import { GitLabService } from './service';
import { GitLabTransformer } from './transformer';
import { IGitLabConfig } from './types';

export function getGitLabService(): GitLabService {
  const { GITLAB_TOKEN, GITLAB_LIMIT, GITLAB_MAX_SOCKETS } = process.env;
  if (!GITLAB_TOKEN) {
    throw new Error('Missing necessary environment variables');
  }
  const config: IGitLabConfig = {
    token: GITLAB_TOKEN,
    limit: Number(GITLAB_LIMIT),
    maxSockets: Number(GITLAB_MAX_SOCKETS) || 10,
  };
  const api: GitLab = new GitLab(config);
  const transformer: GitLabTransformer = new GitLabTransformer();
  return new GitLabService(api, transformer);
}
