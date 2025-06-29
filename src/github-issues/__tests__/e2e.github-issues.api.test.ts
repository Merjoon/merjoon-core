import { GithubIssuesApi } from '../api';
import { IGithubIssuesConfig } from '../types';

const token = process.env.GITHUB_ISSUES_TOKEN;
if (!token) {
  throw new Error('Github issues token has not been set in the environment variables');
}
describe('GitHub Issues API', () => {
  let githubIssues: GithubIssuesApi;
  let config: IGithubIssuesConfig;

  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('Get organizations by pagination', () => {
    beforeEach(async () => {
      config = {
        token,
        limit: 1,
      };
      githubIssues = new GithubIssuesApi(config);
    });
    it('should return all organizations', async () => {
      const getRecordsSpy = jest.spyOn(githubIssues, 'getUserAllOrgs');
      const allOrgs = await githubIssues.getUserAllOrgs();
      const itemsCount = allOrgs.length;
      const totalPagesCalledCount = Math.ceil(itemsCount / githubIssues.limit);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(allOrgs[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        }),
      );
    });
  });
  describe('Get repositories by pagination', () => {
    beforeEach(async () => {
      config = {
        token,
        limit: 1,
      };
      githubIssues = new GithubIssuesApi(config);
    });
    it('should return all repositories', async () => {
      const allOrgs = await githubIssues.getUserAllOrgs();
      const orgId = allOrgs[0].id;
      const getRecordsSpy = jest.spyOn(githubIssues, 'getRecords');
      const allRepos = await githubIssues.getAllReposByOrgId(orgId);
      const itemsCount = allRepos.length;
      let totalPagesCalledCount = Math.ceil(itemsCount / githubIssues.limit);
      const pageCount = itemsCount % githubIssues.limit;
      if (pageCount === 0) {
        totalPagesCalledCount++;
      }
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(2);
      expect(allRepos[0]).toEqual(
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
  describe('Get members by pagination', () => {
    beforeEach(async () => {
      config = {
        token,
        limit: 1,
      };
      githubIssues = new GithubIssuesApi(config);
    });
    it('should return all members', async () => {
      const userOrgs = await githubIssues.getUserAllOrgs();
      const orgId = userOrgs[0].id;
      const getRecordsSpy = jest.spyOn(githubIssues, 'getRecords');
      const allMembers = await githubIssues.getAllMembersByOrgId(orgId);
      const itemsCount = allMembers.length;
      const pageCount = itemsCount % githubIssues.limit;
      let totalPagesCalledCount = Math.ceil(itemsCount / githubIssues.limit);
      if (pageCount === 0) {
        totalPagesCalledCount++;
      }
      expect(totalPagesCalledCount).toBeGreaterThan(2);
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(allMembers[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          login: expect.any(String),
        }),
      );
    });
  });
  describe('Get repository all issues by pagination', () => {
    beforeEach(async () => {
      config = {
        token,
        limit: 3,
      };
      githubIssues = new GithubIssuesApi(config);
    });
    it('should return all issues ', async () => {
      const userOrgs = await githubIssues.getUserAllOrgs();
      const orgId = userOrgs[0].id;
      const orgMembers = await githubIssues.getAllMembersByOrgId(orgId);
      const orgRepos = await githubIssues.getAllReposByOrgId(orgId);
      const getRecordsSpy = jest.spyOn(githubIssues, 'getRecords');
      const repoIssues = await githubIssues.getRepoAllIssues(orgMembers[0].login, orgRepos[1].name);
      let totalPagesCalledCount: number;
      const itemsCount = repoIssues.length;
      const pageCount = itemsCount % githubIssues.limit;
      totalPagesCalledCount = Math.ceil(itemsCount / githubIssues.limit);
      if (pageCount === 0) {
        totalPagesCalledCount++;
      }
      expect(totalPagesCalledCount).toBeGreaterThan(2);
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
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
