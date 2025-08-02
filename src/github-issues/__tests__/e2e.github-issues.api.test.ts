import { GithubIssuesApi } from '../api';
import { IGithubIssuesConfig, IGithubIssuesUrlsInObj } from '../types';

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
      expect(expectedCallCount).toEqual(0); //TODO change organization count to be greater than one, when you already will have more than one organizations.
      expect(userAllOrgs[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        }),
      );
    });
  });
  describe('getAllMembersByOrgId', () => {
    beforeEach(() => {
      config = {
        token,
        limit: 1,
      };
      githubIssues = new GithubIssuesApi(config);
    });
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
      expect(orgAllMembers[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          login: expect.any(String),
        }),
      );
    });
  });
  describe('getAllReposByOrgId', () => {
    beforeEach(() => {
      config = {
        token,
        limit: 1,
      };
      githubIssues = new GithubIssuesApi(config);
    });
    it('should iterate over all members and fetch all pages', async () => {
      const userAllOrgs = await githubIssues.getUserAllOrgs();
      const orgId = userAllOrgs[0].id;
      const getOrgAllReposSpy = jest.spyOn(githubIssues, 'getAllReposByOrgId');
      const getNextSpy = jest.spyOn(githubIssues, 'getNext');
      const orgAllRepos = await githubIssues.getAllReposByOrgId(orgId);
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
        limit: 4,
      };
      githubIssues = new GithubIssuesApi(config);
    });
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
  describe('parseLinkHeader', () => {
    it('should test the first page of parsed urls, if we have 2 entities', async () => {
      const linkHeader =
        '<https://api.github.com/organizations/179821660/members?per_page=1&page=2>; rel="next", <https://api.github.com/organizations/179821660/members?per_page=1&page=2>; rel="last"';
      const parsedUrls: IGithubIssuesUrlsInObj = await GithubIssuesApi.parseLinkHeader(linkHeader);
      expect(parsedUrls).toEqual({
        last: '<https://api.github.com/organizations/179821660/members?per_page=1&page=2>',
        next: '<https://api.github.com/organizations/179821660/members?per_page=1&page=2>',
      });
    });
    it('should test the second page of parsed urls, if we have 2 entities', async () => {
      const linkHeader =
        '<https://api.github.com/organizations/179821660/repos?per_page=1&page=1>; rel="prev", <https://api.github.com/organizations/179821660/repos?per_page=1&page=1>; rel="first"';
      const parsedUrls: IGithubIssuesUrlsInObj = await GithubIssuesApi.parseLinkHeader(linkHeader);
      expect(parsedUrls).toEqual({
        first: '<https://api.github.com/organizations/179821660/repos?per_page=1&page=1>',
        prev: '<https://api.github.com/organizations/179821660/repos?per_page=1&page=1>',
      });
    });
    it('should test the first page of parsed urls, if we have more than 2 entities', async () => {
      const linkHeader =
        '<https://api.github.com/repositories/971262596/issues?per_page=3&page=2&after=Y3Vyc29yOnYyOpLPAAABlmHoX8jOs5p-pw%3D%3D>; rel="next"';
      const parsedUrls: IGithubIssuesUrlsInObj = await GithubIssuesApi.parseLinkHeader(linkHeader);
      expect(parsedUrls).toEqual({
        next: '<https://api.github.com/repositories/971262596/issues?per_page=3&page=2&after=Y3Vyc29yOnYyOpLPAAABlmHoX8jOs5p-pw%3D%3D>',
      });
    });
    it('should test all pages except for the first and last pages of parsed urls, if we have more than 2 entities', async () => {
      const linkHeader =
        '<https://api.github.com/repositories/971262596/issues?per_page=3&page=3&after=Y3Vyc29yOnYyOpLPAAABlmHmqkjOs5pmGQ%3D%3D>; rel="next", <https://api.github.com/repositories/971262596/issues?per_page=3&page=1&before=Y3Vyc29yOnYyOpLPAAABlmHoIUjOs5p6rQ%3D%3D>; rel="prev"';
      const parsedUrls: IGithubIssuesUrlsInObj = await GithubIssuesApi.parseLinkHeader(linkHeader);
      expect(parsedUrls).toEqual({
        next: '<https://api.github.com/repositories/971262596/issues?per_page=3&page=3&after=Y3Vyc29yOnYyOpLPAAABlmHmqkjOs5pmGQ%3D%3D>',
        prev: '<https://api.github.com/repositories/971262596/issues?per_page=3&page=1&before=Y3Vyc29yOnYyOpLPAAABlmHoIUjOs5p6rQ%3D%3D>',
      });
    });
    it('should test the last page of parsed urls, if we have more than 2 entities', async () => {
      const linkHeader =
        '<https://api.github.com/repositories/971262596/issues?per_page=3&page=3&before=Y3Vyc29yOnYyOpLPAAABlmHkvhjOs5pNHA%3D%3D>; rel="prev"';
      const parsedUrls: IGithubIssuesUrlsInObj = await GithubIssuesApi.parseLinkHeader(linkHeader);
      expect(parsedUrls).toEqual({
        prev: '<https://api.github.com/repositories/971262596/issues?per_page=3&page=3&before=Y3Vyc29yOnYyOpLPAAABlmHkvhjOs5pNHA%3D%3D>',
      });
    });
  });
});
