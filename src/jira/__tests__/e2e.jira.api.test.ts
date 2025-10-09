import { JiraApi } from '../api';
import { IJiraConfig } from '../types';
const token = process.env.JIRA_TOKEN;
const email = process.env.JIRA_EMAIL;
const subdomain = process.env.JIRA_SUBDOMAIN;
if (!token || !email || !subdomain) {
  throw new Error('There is no token or email or subdomain');
}

describe('e2e Jira', () => {
  let config: IJiraConfig;
  beforeEach(() => {
    config = {
      token: token,
      email: email,
      subdomain: subdomain,
      limit: 1,
      maxSockets: 10,
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllProjects', () => {
    it('should iterate over all projects, fetch all pages and parse project data correctly', async () => {
      const api = new JiraApi(config);
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const allProjects = await api.getAllProjects();
      const expectedCallCount = allProjects.length % api.limit;
      let totalPages = Math.ceil(allProjects.length / api.limit);
      if (!expectedCallCount) {
        totalPages += 1;
      }
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPages);
      expect(totalPages).toBeGreaterThan(0);

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
      const api = new JiraApi(config);
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const allUsers = await api.getAllUsers();
      const expectedCallCount = allUsers.length % api.limit;
      let totalPages = Math.ceil(allUsers.length / api.limit);
      if (!expectedCallCount) {
        totalPages += 1;
      }
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPages);
      expect(totalPages).toBeGreaterThan(0);

      expect(allUsers[0]).toEqual(
        expect.objectContaining({
          accountId: expect.any(String),
          displayName: expect.any(String),
          emailAddress: expect.any(String),
        }),
      );
    });
  });

  describe('getAllIssuesByProjectIds', () => {
    it('getAllIssuesByProjectIds has been rejected due to absence of projectIds', async () => {
      const api = new JiraApi(config);
      const allIssues = await api.getAllIssuesByProjectIds([]);
      expect(allIssues).toEqual([]);
    });

    it('should iterate over all issues, fetch all pages and parse issue data correctly', async () => {
      config.limit = 12;
      const api = new JiraApi(config);
      const allProjects = await api.getAllProjects();
      const projectIds = allProjects.map((project) => project.id);
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const allIssues = await api.getAllIssuesByProjectIds(projectIds);
      let expectedCallCount = Math.ceil(allIssues.length / api.limit);
      if (!expectedCallCount) {
        expectedCallCount += 1;
      }
      expect(getRecordsSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);

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
          renderedFields: expect.objectContaining({
            description: expect.any(String),
          }),
          self: expect.any(String),
        }),
      );
    });
  });
});
