import {GitLab} from '../api';
import {IGitLabConfig} from '../types';
const token = process.env.GITLAB_TOKEN;
if (!token) {
  throw new Error('GitLab token is not set in the environment variables');
}

describe('GitLab API Tests', () => {
  let gitLab: GitLab;
  let expectedCallCount: number;
  let config: IGitLabConfig;
  beforeEach(async () => {
    config = {
      token: token,
      limit: 8
    };
    gitLab = new GitLab(config);
  });
  afterEach(async () => {
    jest.restoreAllMocks();
  });
  describe('Common pagination' , () => {
    let getRecordsSpy:jest.SpyInstance;
    let totalPages:number;
    beforeEach(() => {
      getRecordsSpy = jest.spyOn(gitLab, 'getRecords');
    });
    afterEach(() => {
      if (expectedCallCount === 0) {
        totalPages += 1;
      }
      expect(getRecordsSpy).toBeCalledTimes(totalPages);
    });
    describe('issues pagination', () => {
      it('should iterate over all issues and fetch all pages', async () => {
        const allIssues = await gitLab.getAllIssues();
        expectedCallCount = allIssues.length % gitLab.limit;
        totalPages = Math.ceil(allIssues.length / gitLab.limit);
      });
    });
    describe('projects pagination', () => {
      it('should iterate over all projects and fetch all pages', async () => {
        const allProjects = await gitLab.getAllProjects();
        expectedCallCount = allProjects.length % gitLab.limit;
        totalPages = Math.ceil(allProjects.length / gitLab.limit);
      });
    });
    describe('groups pagination', () => {
      it('should iterate over all groups and fetch all pages', async () => {
        const allGroups = await gitLab.getAllGroups();
        expectedCallCount = allGroups.length % gitLab.limit;
        totalPages = Math.ceil(allGroups.length / gitLab.limit);
      });
    });
    describe('members pagination', () => {
      let firstGroupId: string;
      it('should take groups id', async () => {
        const groups = await gitLab.getAllGroups();
        firstGroupId = groups[0].id;
      });
      it('should iterate over all members and fetch all pages', async () => {
        const allMembers = await gitLab.getAllMembersByGroupId(firstGroupId);
        expectedCallCount = allMembers.length % gitLab.limit;
        totalPages = Math.ceil(allMembers.length / gitLab.limit);
      });
    });
  });

  describe('getAllGroups', () => {
    it('should parse group data correctly', async () => {
      const groups = await gitLab.getAllGroups();
      expect(groups[0]).toEqual(expect.objectContaining({
        id:expect.any(Number),
      }));
    });
  });
  describe('getAllMembersByGroupId',() => {
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
  describe('getAllIssues', () => {
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
  describe('getAllProjects', () => {
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
