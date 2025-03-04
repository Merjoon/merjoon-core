import { JiraApi } from '../api';
import { IJiraConfig, IJiraIssue, IJiraProject, IJiraUser } from '../types';
const token = process.env.JIRA_TOKEN;
const email = process.env.JIRA_EMAIL;
const subdomain = process.env.JIRA_SUBDOMAIN;
if (!token || !email || !subdomain) {
  throw new Error('There is no token or email or subdomain');
}

describe('e2e Jira', () => {
  let api: JiraApi;
  let config: IJiraConfig;
  let getRecordsSpy: jest.SpyInstance;
  let itemsCount: number;
  beforeEach(() => {
    config = {
      token: token,
      email: email,
      subdomain: subdomain,
      limit: 1,
    };
    api = new JiraApi(config);
    getRecordsSpy = jest.spyOn(api, 'getRecords');
  });

  afterEach(() => {
    const expectedCallCount = itemsCount % api.limit;
    let totalPages = Math.ceil(itemsCount / api.limit);
    if (expectedCallCount === 0) {
      totalPages += 1;
    }
    expect(getRecordsSpy).toHaveBeenCalledTimes(totalPages);
    jest.restoreAllMocks();
  });

  describe('getAllProjects', () => {
    it('should iterate over all projects, fetch all pages and parse project data correctly', async () => {
      const allProjects: IJiraProject[] = await api.getAllProjects();
      itemsCount = allProjects.length;

      expect(allProjects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      );
    });
  });

  describe('getAllUsers', () => {
    it('should iterate over all users, fetch all pages and parse user data correctly', async () => {
      const allUsers: IJiraUser[] = await api.getAllUsers();
      itemsCount = allUsers.length;

      expect(allUsers[0]).toEqual(
        expect.objectContaining({
          accountId: expect.any(String),
          displayName: expect.any(String),
          emailAddress: expect.any(String),
        }),
      );
    }, 10000);
  });

  describe('getAllIssues', () => {
    it('should iterate over all issues, fetch all pages and parse issue data correctly', async () => {
      const allIssues: IJiraIssue[] = await api.getAllIssues();
      itemsCount = allIssues.length;

      expect(allIssues[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          fields: expect.objectContaining({
            summary: expect.any(String),
            created: expect.any(String),
            updated: expect.any(String),
            description: expect.any(Object),
            project: expect.objectContaining({
              id: expect.any(String),
            }),
            status: expect.objectContaining({
              name: expect.any(String),
            }),
            assignee: expect.objectContaining({
              accountId: expect.any(String),
            }),
          }),
          self: expect.any(String),
        }),
      );
    }, 15000);
  });
});
