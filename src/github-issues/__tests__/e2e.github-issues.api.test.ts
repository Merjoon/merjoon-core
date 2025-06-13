import { GithubIssuesApi } from '../api';
import {
  IGithubIssuesConfig,
  IGithubIssuesMember,
  IGithubIssuesOrg,
  IGithubIssuesRepo,
} from '../types';

const token = process.env.GITHUB_ISSUES_TOKEN;
if (!token) {
  throw new Error('Github issues token has not been set in the environment variables');
}
describe('GitHub Issues API', () => {
  let githubIssues: GithubIssuesApi;
  let config: IGithubIssuesConfig;
  beforeEach(async () => {
    config = {
      token: token,
    };
    githubIssues = new GithubIssuesApi(config);
  });
  describe('getUserOrgs', () => {
    it('must return all organizations', async () => {
      const userOrgs = await githubIssues.getUserOrgs();
      expect(userOrgs[0]).toMatchObject({
        id: expect.any(Number),
        login: expect.any(String),
      });
    });
  });
  describe('getOrgReposByOrgId', () => {
    it('must return all repositories from each organization', async () => {
      const userOrgs: IGithubIssuesOrg[] = await githubIssues.getUserOrgs();
      const allOrgsRepos: IGithubIssuesRepo[] = [];
      for (const userOrg of userOrgs) {
        const orgRepos = await githubIssues.getOrgReposByOrgId(userOrg.id);
        const result = allOrgsRepos.concat(orgRepos);
        expect(result[0]).toMatchObject({
          id: expect.any(Number),
          full_name: expect.any(String),
          owner: expect.any(String),
        });
      }
    });
  });
  describe('getOrgMembersByOrgId', () => {
    it('must return all members from each organization', async () => {
      const userOrgs: IGithubIssuesOrg[] = await githubIssues.getUserOrgs();
      const allOrgsMembers: IGithubIssuesMember[] = [];
      for (const userOrg of userOrgs) {
        const orgMembers = await githubIssues.getOrgMembersByOrgId(userOrg.id);
        const result = allOrgsMembers.concat(orgMembers);
        expect(result[0]).toMatchObject({
          id: expect.any(Number),
          login: expect.any(String),
          site_admin: expect.any(Boolean),
        });
      }
    });
  });
});
