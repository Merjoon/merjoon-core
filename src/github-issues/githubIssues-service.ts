import { IGithubIssuesConfig } from './types';
import { GithubIssuesApi } from './api';
import { GithubIssuesTransformer } from './transformer';
import { GithubIssuesService } from './service';

export function getGithubIssuesService() {
  const { GITHUB_ISSUES_TOKEN, GITHUB_ISSUES_LIMIT } = process.env;
  if (!GITHUB_ISSUES_TOKEN) {
    throw new Error('Missing necessary environment variable');
  }
  const config: IGithubIssuesConfig = {
    token: GITHUB_ISSUES_TOKEN,
    limit: Number(GITHUB_ISSUES_LIMIT),
  };
  const api: GithubIssuesApi = new GithubIssuesApi(config);
  const transformer: GithubIssuesTransformer = new GithubIssuesTransformer();
  return new GithubIssuesService(api, transformer);
}
