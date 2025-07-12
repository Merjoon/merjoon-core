jest.setTimeout(30000);

import { GithubIssuesApi } from '../api';
import { IGithubIssuesConfig } from '../types';

const token = process.env.GITHUB_ISSUES_TOKEN;
if (!token) {
  throw new Error('Github issues token has not been set in the environment variables');
}
describe('GitHub Issues API', () => {
  let githubIssues: GithubIssuesApi;
  let config: IGithubIssuesConfig;
  beforeEach(() => {
    config = {
      token,
      limit: 1,
    };
    githubIssues = new GithubIssuesApi(config);
  });
  afterEach(async () => {
    jest.resetAllMocks();
  });
  describe('Get repository all organizations by pagination', () => {
    it('should iterate over all organizations and fetch all pages', async () => {
      const getUserAllOrgsSpy = jest.spyOn(githubIssues, 'getUserAllOrgs');
      const getNextSpy = jest.spyOn(githubIssues, 'getNext');
      const userAllOrgs = await githubIssues.getUserAllOrgs();
      const expectedCallCount = Math.ceil(userAllOrgs.length / config.limit) - 1;
      expect(getUserAllOrgsSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toEqual(0);
    });
  });
  describe('Get organization all members by pagination', () => {
    it('should iterate over all members and fetch all pages', async () => {
      const userAllOrgs = await githubIssues.getUserAllOrgs();
      const orgId = userAllOrgs[0].id;
      const getOrgAllMembersSpy = jest.spyOn(githubIssues, 'getAllMembersByOrgId');
      const getNextSpy = jest.spyOn(githubIssues, 'getNext');
      const orgAllMembers = await githubIssues.getAllMembersByOrgId(orgId);
      const expectedCallCount = Math.ceil(orgAllMembers.length / config.limit) - 1;
      expect(getOrgAllMembersSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
    });
  });
  describe('Get organization all repositories by pagination', () => {
    it('should iterate over all members and fetch all pages', async () => {
      const userAllOrgs = await githubIssues.getUserAllOrgs();
      const orgId = userAllOrgs[0].id;
      const getOrgAllReposSpy = jest.spyOn(githubIssues, 'getAllMembersByOrgId');
      const getNextSpy = jest.spyOn(githubIssues, 'getNext');
      const orgAllRepos = await githubIssues.getAllMembersByOrgId(orgId);
      const expectedCallCount = Math.ceil(orgAllRepos.length / config.limit) - 1;
      expect(getOrgAllReposSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
    });
  });
  describe('Get repository all issues by pagination', () => {
    it('should iterate over all issues and fetch all pages', async () => {
      const userOrgs = await githubIssues.getUserAllOrgs();
      const orgId = userOrgs[0].id;
      const orgMembers = await githubIssues.getAllMembersByOrgId(orgId);
      const orgRepos = await githubIssues.getAllReposByOrgId(orgId);
      const getAllIssuesSpy = jest.spyOn(githubIssues, 'getRepoAllIssues');
      const getNextSpy = jest.spyOn(githubIssues, 'getNext');
      const allIssues = await githubIssues.getRepoAllIssues(orgMembers[0].login, orgRepos[0].name);
      const expectedCallCount = Math.ceil(allIssues.length / config.limit) - 1;
      expect(getAllIssuesSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
    });
  });
});
