import { TeamworkApi } from '../api';
import { ITeamworkConfig, ITeamworkPeople, ITeamworkProject, ITeamworkTask } from '../types';
const token = process.env.TEAMWORK_TOKEN;
const password = process.env.TEAMWORK_PASSWORD;
const subdomain = process.env.TEAMWORK_SUBDOMAIN;
if (!token || !password || !subdomain) {
  throw new Error('There is no token or password or subdomain');
}

describe('e2e TeamworkApi', () => {
  let api: TeamworkApi;
  let config: ITeamworkConfig;
  beforeEach(() => {
    config = {
      token: token,
      password: password,
      subdomain: subdomain,
      limit: 1,
    };
    api = new TeamworkApi(config);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllProjects', () => {
    it('should iterate over all projects, fetch all pages and parse project data correctly', async () => {
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const allProjects: ITeamworkProject[] = await api.getAllProjects();
      const expectedCallCount = Math.ceil(allProjects.length / config.limit);
      expect(getRecordsSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);

      expect(allProjects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });

  describe('getAllPeople', () => {
    it('should iterate over all people, fetch all pages and parse people data correctly', async () => {
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const allPeople: ITeamworkPeople[] = await api.getAllPeople();
      const expectedCallCount = Math.ceil(allPeople.length / config.limit);
      expect(getRecordsSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
      expect(allPeople[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });

  describe('getAllTasks', () => {
    it('should iterate over all tasks, fetch all pages and parse task data correctly', async () => {
      config.limit = 5;
      const api = new TeamworkApi(config);
      const getRecordsSpy = jest.spyOn(api, 'getRecords');

      getRecordsSpy.mockClear();
      const allTasks: ITeamworkTask[] = await api.getAllTasks();
      const expectedCallCount = Math.ceil(allTasks.length / config.limit);
      expect(getRecordsSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
      expect(allTasks[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          assigneeUsers: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
            }),
          ]),
          status: expect.any(String),
          description: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });
});
