import { GithubIssuesApi } from '../api';
import { IGithubIssuesConfig } from '../types';

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
      maxSockets: 10,
    };
    githubIssues = new GithubIssuesApi(config);
  });
  describe('getUserOrgs', () => {
    it('must return all organizations', async () => {
      const userOrgs = await githubIssues.getUserOrgs();
      expect(userOrgs[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        }),
      );
    });
  });
  describe('getReposByOrgId', () => {
    it('must return all repositories from each organization', async () => {
      const userOrgs = await githubIssues.getUserOrgs();
      const orgRepos = await githubIssues.getReposByOrgId(userOrgs[0].id);
      expect(orgRepos[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      );
    });
  });
  describe('getMembersByOrgId', () => {
    it('must return all members from each organization', async () => {
      const userOrgs = await githubIssues.getUserOrgs();
      const orgMembers = await githubIssues.getMembersByOrgId(userOrgs[0].id);
      expect(orgMembers[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          login: expect.any(String),
        }),
      );
    });
  });
  describe('getRepoIssues', () => {
    it('must return all issues from each repository', async () => {
      const userOrgs = await githubIssues.getUserOrgs();
      const orgId = userOrgs[0].id;
      const orgMembers = await githubIssues.getMembersByOrgId(orgId);
      const orgRepos = await githubIssues.getReposByOrgId(orgId);
      const repoIssues = await githubIssues.getRepoIssues(orgMembers[0].login, orgRepos[0].name);
      expect(repoIssues[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          assignees: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
            }),
          ]),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          state: expect.any(String),
          body: expect.any(String),
          url: expect.any(String),
        }),
      );
    });
  });
});
