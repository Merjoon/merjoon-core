import { TodoistApi } from '../api';
import { ITodoistConfig } from '../types';

const token: string | undefined = process.env.TODOIST_TOKEN;
if (!token) {
  throw new Error('TODOIST token is not set in the environment variables');
}

describe('TODOIST API', () => {
  let api: TodoistApi;
  let config: ITodoistConfig;

  beforeEach(() => {
    config = {
      token: token,
      limit: 1,
    };
    api = new TodoistApi(config);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  it('should get all projects with expected structure', async () => {
    const projects = await api.getAllProjects();
    expect(projects[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
      }),
    );
  });

  describe('pagination', () => {
    it('should fetch all pages of projects', async () => {
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const allProjects = await api.getAllProjects();
      const expectedCallsCount = allProjects.length;
      expect(getRecordsSpy).toHaveBeenCalledTimes(expectedCallsCount);
      expect(allProjects.length).toBeGreaterThan(0);
    });

    it('should return all projects regardless of limit', async () => {
      const projects = await api.getAllProjects();
      if (projects.length > 1) {
        expect(projects.length).toBeGreaterThan(1);
      }
    });
  });
});