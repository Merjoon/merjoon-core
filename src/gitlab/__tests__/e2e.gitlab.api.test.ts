jest.setTimeout(15000);
import { GitLabApi } from '../api';
import { IGitLabConfig } from '../types';
const token = process.env.GITLAB_TOKEN;
if (!token) {
  throw new Error('GitLab token is not set in the environment variables');
}
describe('GitLab API', () => {
  let gitLab: GitLabApi;
  let config: IGitLabConfig;
  beforeEach(async () => {
    config = {
      token: token,
      limit: 1,
    };
    gitLab = new GitLabApi(config);
  });
  afterEach(async () => {
    jest.restoreAllMocks();
  });
  describe('Get Records Pagination', () => {
    let getRecordsSpy: jest.SpyInstance;
    let totalPagesCalledCount: number;
    let itemsCount: number;
    let expectedCallCount: number;
    beforeEach(() => {
      getRecordsSpy = jest.spyOn(gitLab, 'getRecords');
    });
    afterEach(() => {
      expectedCallCount = itemsCount % gitLab.limit;
      totalPagesCalledCount = Math.ceil(itemsCount / gitLab.limit);
      if (expectedCallCount === 0) {
        totalPagesCalledCount += 1;
      }
      expect(getRecordsSpy).toBeCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
    });
    describe('getAllIssues', () => {
      it('should iterate over all issues and fetch all pages', async () => {
        config.limit = 11;
        const allIssues = await gitLab.getAllIssues();
        itemsCount = allIssues.length;
      });
    });
    describe('getAllProjects', () => {
      it('should iterate over all projects and fetch all pages', async () => {
        const allProjects = await gitLab.getAllProjects();
        itemsCount = allProjects.length;
      });
    });
    describe('getAllGroups', () => {
      it('should iterate over all groups and fetch all pages', async () => {
        const allGroups = await gitLab.getAllGroups();
        itemsCount = allGroups.length;
      });
    });
    describe('getAllMembersByGroupId', () => {
      it('should iterate over all members and fetch all pages', async () => {
        const groups = await gitLab.getAllGroups();
        getRecordsSpy.mockClear();
        const allMembers = await gitLab.getAllMembersByGroupId(groups[0].id);
        itemsCount = allMembers.length;
      });
    });
  });

  describe('getAllGroups', () => {
    it('should parse group data correctly', async () => {
      const groups = await gitLab.getAllGroups();
      expect(groups[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        }),
      );
    });
  });
  describe('getAllMembersByGroupId', () => {
    it('should parse member data correctly', async () => {
      const groups = await gitLab.getAllGroups();
      const members = await gitLab.getAllMembersByGroupId(groups[0].id);
      const membersByGroupId = members.flat();
      expect(membersByGroupId[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          username: expect.any(String),
        }),
      );
    });
  });
  describe('getAllIssues', () => {
    it('should parse issue data correctly', async () => {
      const issues = await gitLab.getAllIssues();
      expect(issues[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          assignee: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
          description: expect.any(String),
          created_at: expect.any(String),
          state: expect.any(String),
          web_url: expect.any(String),
          labels: expect.arrayContaining([expect.any(String)]),
        }),
      );
    });
  });
  describe('getAllProjects', () => {
    it('should parse project data correctly', async () => {
      const projects = await gitLab.getAllProjects();
      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          last_activity_at: expect.any(String),
          created_at: expect.any(String),
        }),
      );
    });
  });
});
