import { GithubIssuesApi } from '../api';
import { IGithubIssuesConfig } from '../types';

const token = process.env.GITHUB_ISSUES_TOKEN;
if (!token) {
  throw new Error('Github issues token has not been set in the environment variables');
}
describe('GitHub Issues API', () => {
  let githubIssues: GithubIssuesApi;
  let config: IGithubIssuesConfig;
  afterEach(async () => {
    jest.resetAllMocks();
  });

  describe('getUserAllOrgs', () => {
    beforeEach(() => {
      config = {
        token,
        limit: 1,
        maxSockets: 10,
      };
      githubIssues = new GithubIssuesApi(config);
    });

    it('should iterate over all organizations and fetch all pages', async () => {
      const getUserAllOrgsSpy = jest.spyOn(githubIssues, 'getUserAllOrgs');
      const getNextSpy = jest.spyOn(githubIssues, 'getNext');
      const userAllOrgs = await githubIssues.getUserAllOrgs();
      const expectedCallCount = Math.ceil(userAllOrgs.length / config.limit) - 1;
      expect(getUserAllOrgsSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
      expect(userAllOrgs[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        }),
      );
    });
  });

  describe('getAllMembersByOrgLogin', () => {
    beforeEach(() => {
      config = {
        token,
        limit: 1,
        maxSockets: 10,
      };
      githubIssues = new GithubIssuesApi(config);
    });

    it('should iterate over all members and fetch all pages', async () => {
      const userAllOrgs = await githubIssues.getUserAllOrgs();
      const orgLogin = userAllOrgs[0].login;
      const getOrgAllMembersSpy = jest.spyOn(githubIssues, 'getAllMembersByOrgLogin');
      const getNextSpy = jest.spyOn(githubIssues, 'getNext');
      const orgAllMembers = await githubIssues.getAllMembersByOrgLogin(orgLogin);
      const expectedCallCount = Math.ceil(orgAllMembers.length / config.limit) - 1;
      expect(getOrgAllMembersSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
      expect(orgAllMembers[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          login: expect.any(String),
        }),
      );
    });
  });

  describe('getAllReposByOrgLogin', () => {
    beforeEach(() => {
      config = {
        token,
        limit: 1,
        maxSockets: 10,
      };
      githubIssues = new GithubIssuesApi(config);
    });

    it('should iterate over all members and fetch all pages', async () => {
      const userAllOrgs = await githubIssues.getUserAllOrgs();
      const orgLogin = userAllOrgs[0].login;
      const getOrgAllReposSpy = jest.spyOn(githubIssues, 'getAllReposByOrgLogin');
      const getNextSpy = jest.spyOn(githubIssues, 'getNext');
      const orgAllRepos = await githubIssues.getAllReposByOrgLogin(orgLogin);
      const expectedCallCount = Math.ceil(orgAllRepos.length / config.limit) - 1;
      expect(getOrgAllReposSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
      expect(orgAllRepos[0]).toEqual(
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

  describe('getRepoAllIssues', () => {
    beforeEach(() => {
      config = {
        token,
        limit: 2,
        maxSockets: 10,
      };
      githubIssues = new GithubIssuesApi(config);
    });

    it('should iterate over all issues and fetch all pages', async () => {
      const userOrgs = await githubIssues.getUserAllOrgs();
      const orgLogin = userOrgs[0].login;
      const orgRepos = await githubIssues.getAllReposByOrgLogin(orgLogin);
      const orgRepo = orgRepos[0];
      const getAllIssuesSpy = jest.spyOn(githubIssues, 'getRepoAllIssues');
      const getNextSpy = jest.spyOn(githubIssues, 'getNext');
      const allIssues = await githubIssues.getRepoAllIssues(orgRepo.owner.login, orgRepo.name);
      const expectedCallCount = Math.ceil(allIssues.length / config.limit) - 1;
      expect(getAllIssuesSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
      expect(allIssues[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          assignees: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              login: expect.any(String),
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
