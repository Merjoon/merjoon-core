import { FreedcampApi } from '../api';
import { IFreedcampConfig, IFreedcampTask } from '../types';

const apiKey = process.env.FREEDCAMP_API_KEY;
const apiSecret = process.env.FREEDCAMP_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error('Freedcamp apiKey or apiSecret is not set in the environment variables');
}

describe('Freedcamp API', () => {
  let freedcamp: FreedcampApi;
  let config: IFreedcampConfig;

  beforeEach(async () => {
    config = {
      apiKey,
      apiSecret,
      limit: 7,
      maxSockets: 10,
    };
    freedcamp = new FreedcampApi(config);
  });

  describe('GetAllProjects', () => {
    it('should parse Projects data correctly', async () => {
      const projects = await freedcamp.getProjects();
      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          project_name: expect.any(String),
          project_description: expect.any(String),
          created_ts: expect.any(Number),
        }),
      );
    });
  });

  describe('GetAllUsers', () => {
    it('should parse Users data correctly', async () => {
      const users = await freedcamp.getUsers();
      expect(users[0]).toEqual(
        expect.objectContaining({
          user_id: expect.any(String),
          first_name: expect.any(String),
          last_name: expect.any(String),
          email: expect.any(String),
        }),
      );
    });
  });

  describe('Get Tasks Pagination', () => {
    let getRecordsSpy: jest.SpyInstance;
    let itemsCount: number;
    let totalPagesCalledCount: number;
    beforeEach(() => {
      getRecordsSpy = jest.spyOn(freedcamp, 'getRecords');
    });

    afterEach(() => {
      totalPagesCalledCount = Math.ceil(itemsCount / freedcamp.limit);
      expect(totalPagesCalledCount).toBeGreaterThan(2);
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
    });

    it('should parse Tasks data correctly', async () => {
      const allTasks = await freedcamp.getAllTasks();
      itemsCount = allTasks.length;
      expect(allTasks[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          assigned_ids: expect.arrayContaining([expect.any(String)]),
          project_id: expect.any(String),
          status_title: expect.any(String),
          description: expect.any(String),
          created_ts: expect.any(Number),
          updated_ts: expect.any(Number),
          url: expect.any(String),
        }),
      );
    });
  });

  describe('Normalize assignedIds', () => {
    it('should clear assigned_ids if it contains only "0"', async () => {
      const task: IFreedcampTask = {
        id: '62784728',
        title: 'Task2',
        status_title: 'In Progress',
        assigned_ids: ['0'],
        project_id: '3639d98ff2b3a5d1eda110dea4a6bd83',
        description: 'Very important task',
        created_ts: 1754398440434,
        updated_ts: 1754398440434,
        url: 'https://freedcamp.com/view/3543358/tasks/62784728',
      };
      FreedcampApi.normalizeAssignedIds(task);
      expect(task).toEqual({
        id: '62784728',
        title: 'Task2',
        status_title: 'In Progress',
        assigned_ids: [],
        project_id: '3639d98ff2b3a5d1eda110dea4a6bd83',
        description: 'Very important task',
        created_ts: 1754398440434,
        updated_ts: 1754398440434,
        url: 'https://freedcamp.com/view/3543358/tasks/62784728',
      });
    });

    it('should keep assigned_ids unchanged if it contains valid Ids', async () => {
      const task: IFreedcampTask = {
        id: '62784728',
        title: 'Task5',
        status_title: 'In Progress',
        assigned_ids: ['2243972'],
        project_id: '3639d98ff2b3a5d1eda110dea4a6bd83',
        description: 'Very important task',
        created_ts: 1754398440434,
        updated_ts: 1754398440434,
        url: 'https://freedcamp.com/view/3543358/tasks/62784728',
      };
      FreedcampApi.normalizeAssignedIds(task);
      expect(task).toEqual({
        id: '62784728',
        title: 'Task5',
        status_title: 'In Progress',
        assigned_ids: ['2243972'],
        project_id: '3639d98ff2b3a5d1eda110dea4a6bd83',
        description: 'Very important task',
        created_ts: 1754398440434,
        updated_ts: 1754398440434,
        url: 'https://freedcamp.com/view/3543358/tasks/62784728',
      });
    });
  });
});
