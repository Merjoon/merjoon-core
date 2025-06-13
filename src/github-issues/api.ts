import axios from 'axios';
import { HttpClient } from '../common/HttpClient';
import { IGithubIssuesConfig, IGithubIssuesMember, IGithubIssuesRepo } from './types';
import { IMerjoonApiConfig } from '../common/types';

export class GithubIssuesApi extends HttpClient {
  constructor(protected config: IGithubIssuesConfig) {
    const basePath = 'https://api.github.com';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    };
    super(apiConfig);
  }
  public async getUserOrgs() {
    const path = 'user/orgs';
    const response = await axios.get(`https://api.github.com/${path}`, {
      headers: {
        Authorization: `Bearer ${this.config.token}`,
      },
    });
    return response.data;
  }
  public async getOrgReposByOrgId(orgId: number) {
    const path = `orgs/${orgId}/repos`;
    const response = await axios.get(`https://api.github.com/${path}`, {
      headers: {
        Authorization: `Bearer ${this.config.token}`,
      },
    });
    const repos = response.data;
    const modifiedRepo: IGithubIssuesRepo[] = [];
    for (const repo of repos) {
      modifiedRepo.push({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.owner.login,
        owner_id: repo.owner.id,
      });
    }
    return modifiedRepo;
  }
  public async getOrgMembersByOrgId(orgId: number): Promise<IGithubIssuesMember> {
    const path = `orgs/${orgId}/members`;
    const response = await axios.get(`https://api.github.com/${path}`, {
      headers: {
        Authorization: `Bearer ${this.config.token}`,
      },
    });
    return response.data;
  }
}
