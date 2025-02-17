import {GitLab} from '../api';
import {IGitLabConfig} from '../types';
const token = process.env.GITLAB_TOKEN;
import {GITLAB_PATH} from '../consts';
if(!token){
  throw new Error();
}
const config: IGitLabConfig = {
  token: token,
  limit: 3,
};
describe('issues', () => {
  let gitLab: GitLab;
  const limit = config.limit;
  beforeEach(() => {
    gitLab = new GitLab(config);
    jest.clearAllMocks();
  });
  it('should iterate over all records and fetch all pages from ISSUES', async () => {
    const spy = jest.spyOn(gitLab, 'getRecords');
    const iterator = gitLab.getAllRecordsInterator(GITLAB_PATH.ISSUES);

    const allRecords = [];
    for await (const records of iterator) {
      allRecords.push(...records);
    }

    const expectedCallCount = Math.ceil(allRecords.length  / (limit ?? 10));
    const recordSpy = spy.mock.calls.length;
    expect([recordSpy, recordSpy - 1]).toContain(expectedCallCount);
  },50000);
});

describe('groups', () => {
  let gitLab: GitLab;
  const limit = config.limit;
  beforeEach(() => {
    gitLab = new GitLab(config);
    jest.clearAllMocks();
  });
  it('should iterate over all records and fetch all pages from groups', async () => {
    const spy = jest.spyOn(gitLab, 'getRecords');
    const iterator = gitLab.getAllRecordsInterator(GITLAB_PATH.GROUPS);
    const allRecords = [];
    for await (const records of iterator) {
      allRecords.push(...records);
    }
    const expectedCallCount = Math.ceil(allRecords.length  / (limit ?? 10));
    const recordSpy = spy.mock.calls.length;
    console.log(recordSpy);
    expect([recordSpy, recordSpy - 1]).toContain(expectedCallCount);
  });
});
describe('MemberbyGroupID', () => {
  let gitLab: GitLab;
  const limit = config.limit;
  beforeEach(() => {
    gitLab = new GitLab(config);
    jest.clearAllMocks();
  });
  it('should iterate over all records and fetch all pages from groups', async () => {
    const spy = jest.spyOn(gitLab, 'getRecords');
    const groups = await  gitLab.getAllGroups();
    const iterator = gitLab.getAllRecordsInterator(GITLAB_PATH.MEMBERS(groups[0].id));
    const allRecords = [];
    for await (const records of iterator) {
      allRecords.push(...records);
    }
    const expectedCallCount = Math.ceil(allRecords.length  / (limit ?? 10));
    const recordSpy = spy.mock.calls.length;
    expect([recordSpy, recordSpy - 1]).toContain(expectedCallCount);
  });
});
describe('Projects', () => {
  let gitLab: GitLab;
  const limit = config.limit;
  beforeEach(() => {
    gitLab = new GitLab(config);
    jest.clearAllMocks();
  });
  it('should iterate over all records and fetch all pages from groups', async () => {
    const spy = jest.spyOn(gitLab, 'getRecords');
    const iterator = gitLab.getAllRecordsInterator(GITLAB_PATH.PROJECTS , {owned:true});
    const allRecords = [];
    for await (const records of iterator) {
      allRecords.push(...records);
    }
    const expectedCallCount = Math.ceil(allRecords.length  / (limit ?? 10));
    const recordSpy = spy.mock.calls.length;
    expect([recordSpy, recordSpy - 1]).toContain(expectedCallCount);
  },50000);
});
describe('Groups',  () => {
  it('parses a gitlab Groups test', async () => {
    const gitLab = new GitLab(config);
    const groups = await gitLab.getAllGroups();
    expect(groups[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
    }));
  });
});
describe('Members', () => {
  it('parses a gitlab Groups test', async () => {
    const gitlab = new GitLab(config);
    const groups = await  gitlab.getAllGroups();
    const members = await gitlab.getAllMembersByGroupId(groups[0].id);
    const membersByGroupId = members.flat();
    expect(membersByGroupId[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
      username: expect.any(String),
    }));
  });
});
describe('Issues', () => {
  it('parses a gitlab issues test', async () => {
    const gitLab = new GitLab(config);
    const issues = await gitLab.getAllIssues();

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

describe('projects', () => {
  it('parses a gitlab projects test', async () => {
    const gitLab = new GitLab(config);
    const projects = await gitLab.getAllProjects();

    expect(projects[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      last_activity_at: expect.any(String),
      created_at: expect.any(String),
    }));
  });
});
