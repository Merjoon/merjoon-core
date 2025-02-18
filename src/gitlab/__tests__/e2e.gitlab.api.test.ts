import {GitLab} from '../api';
import {IGitLabConfig} from '../types';
const token = process.env.GITLAB_TOKEN;
if (!token) {
  throw new Error('GitLab token is not set in the environment variables');
}

describe('GitLab API Tests', () => {
  let gitLab: GitLab;
  let config: IGitLabConfig;
  beforeEach(async () => {
    config = {
      token: token,
      limit: 5
    };
    gitLab = new GitLab(config);
  });
  afterEach(async () => {
    jest.restoreAllMocks();
  });

  function testPagination<T>(getMethod: () => Promise<T[]>,entityName: string) {
    it(`should iterate over all ${entityName} and fetch all pages`, async () => {
      const spy = jest.spyOn(gitLab, 'getRecords');
      const allEntities = await getMethod();
      const expectedCallCount = Math.ceil(allEntities.length / gitLab.limit);
      const recordSpy = spy.mock.calls.length;
      expect([recordSpy, recordSpy - 1]).toContain(expectedCallCount);
    });
  }

  describe('test issues pagination', () => {
    testPagination(() => gitLab.getAllIssues(), 'issues');
  });

  describe('test projects pagination', () => {
    testPagination(() => gitLab.getAllProjects(), 'projects');
  });

  describe('test groups pagination', () => {
    testPagination(() => gitLab.getAllGroups(), 'groups');
  });
  describe('test members pagination', () => {
    let firstGroupId: string;
    it('should take groups id', async () => {
      const groups = await gitLab.getAllGroups();
      firstGroupId=groups[0].id;
    });
    testPagination(() => gitLab.getAllMembersByGroupId(firstGroupId), 'members');
  });
  describe('Group Validation', () => {
    it('should parse group data correctly', async () => {
      const groups = await gitLab.getAllGroups();
      expect(groups[0]).toEqual(expect.objectContaining({
        id:expect.any(Number),
      }));
    });
  });
  describe('Members Validation',() => {
    it('should parse member data correctly', async () => {
      const groups = await  gitLab.getAllGroups();
      const members = await gitLab.getAllMembersByGroupId(groups[0].id);
      const membersByGroupId = members.flat();
      expect(membersByGroupId[0]).toEqual(expect.objectContaining({
        id:expect.any(Number),
        username: expect.any(String),
      }));
    });
  });
  describe('Issues Validation', () => {
    it('should parse issue data correctly', async () => {
      const issues= await gitLab.getAllIssues();
      expect(issues[0]).toEqual(expect.objectContaining({
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
      }));
    });
  });
  describe('Project Validation', () => {
    it('should parse project data correctly', async () => {
      const projects = await gitLab.getAllProjects();
      expect(projects[0]).toEqual(expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        last_activity_at: expect.any(String),
        created_at: expect.any(String)
      }));
    });
  });
});
