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
  let config:ITeamworkConfig;
  beforeEach(() => {
    config = {
      token: token,
      password: password,
      subdomain: subdomain,
        
      // limit: 5,
    };
    api = new TeamworkApi(config);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('getAllProjects', () => {
    it('should iterate over all projects, fetch all pages and parse project data correctly', async () => {
      const getAllRecordsSpy = jest.spyOn(api, 'getAllRecords');

      const allProjects: ITeamworkProject[] = await api.getAllProjects();
      // const expectedCallCount = Math.ceil(allEntities.length / config.limit) - 1;

      // expect(getStoriesSpy).toHaveBeenCalledTimes(1);
      // expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);

      console.log(getAllRecordsSpy.mock.calls.length);
      console.log(allProjects);

      expect(allProjects[0]).toEqual(expect.objectContaining({
        id:expect.any(Number),
        name: expect.any(String),
        description:expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }));

      jest.restoreAllMocks();
    });
  });

  describe('getAllUsers', () => {
    it('should iterate over all users, fetch all pages and parse user data correctly', async () => {
      const getAllRecordsSpy = jest.spyOn(api, 'getAllUsers');

      const allUsers: ITeamworkPeople[] = await api.getAllUsers();
      // const expectedCallCount = Math.ceil(allEntities.length / config.limit) - 1;

      // expect(getStoriesSpy).toHaveBeenCalledTimes(1);
      // expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);

      console.log(getAllRecordsSpy.mock.calls.length);
      console.log(allUsers);

      expect(allUsers[0]).toEqual(expect.objectContaining({
        id:expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }));

      jest.restoreAllMocks();
    });
  });

  describe('getAllIssues', () => {
    it('should iterate over all issues, fetch all pages and parse issue data correctly', async () => {
      const getAllRecordsSpy = jest.spyOn(api, 'getAllIssues');

      const allProjects: ITeamworkProject[] = await api.getAllProjects();
      const allIssues: ITeamworkTask[] = await api.getAllIssues(allProjects[0].id);
      // const expectedCallCount = Math.ceil(allEntities.length / config.limit) - 1;

      // expect(getStoriesSpy).toHaveBeenCalledTimes(1);
      // expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);

      console.log(getAllRecordsSpy.mock.calls.length);
      console.log(allIssues);

      expect(allIssues[0]).toEqual(expect.objectContaining({
        id:expect.any(Number),
        description: expect.any(String),
        assigneeUsers: expect.any(Array),
        // email: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }));

      jest.restoreAllMocks();
    });
  });
});