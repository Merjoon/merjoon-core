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
      maxSockets: 10,
    };
    gitLab = new GitLabApi(config);
  });
  afterEach(async () => {
    jest.restoreAllMocks();
  });
  describe('getAllIssues', () => {
    it('should iterate over all issues and fetch all pages, parse data correctly', async () => {
      config.limit = 8;
      gitLab = new GitLabApi(config);
      const getRecordsSpy = jest.spyOn(gitLab, 'getRecords');
      const allIssues = await gitLab.getAllIssues();
      const totalPagesCalledCount = Math.ceil(allIssues.length / gitLab.limit);

      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
      expect(allIssues[0]).toEqual(
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
    it('should iterate over all projects and fetch all pages, parse data correctly, parse data correctly', async () => {
      const getRecordsSpy = jest.spyOn(gitLab, 'getRecords');
      const allProjects = await gitLab.getAllProjects();
      const totalPagesCalledCount = Math.ceil(allProjects.length / gitLab.limit);

      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
      expect(allProjects[0]).toEqual(
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
  describe('getAllGroups', () => {
    it('should iterate over all groups and fetch all pages and parse data correctly', async () => {
      const getRecordsSpy = jest.spyOn(gitLab, 'getRecords');
      const allGroups = await gitLab.getAllGroups();
      const totalPagesCalledCount = Math.ceil(allGroups.length / gitLab.limit);

      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
      expect(allGroups[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        }),
      );
    });
  });
  describe('getAllMembersByGroupId', () => {
    it('should iterate over all members and fetch all pages, parse data correctly', async () => {
      const getRecordsSpy = jest.spyOn(gitLab, 'getRecords');
      const groups = await gitLab.getAllGroups();
      getRecordsSpy.mockClear();
      const allMembers = await gitLab.getAllMembersByGroupId(groups[0].id);
      const membersByGroupId = allMembers.flat();
      const totalPagesCalledCount = Math.ceil(allMembers.length / gitLab.limit);

      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
      expect(membersByGroupId[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          username: expect.any(String),
        }),
      );
    });
  });
});
