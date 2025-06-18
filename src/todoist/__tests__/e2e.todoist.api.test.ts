import { TodoistApi } from '../api';
import { ITodoistConfig, ITodoistProject } from '../types';
const token: string | undefined = process.env.TODOIST_TOKEN;
const limit: string | undefined = process.env.TODOIST_LIMIT;
if (!token) {
  throw new Error('TODOIST token is not set in the environment variables');
}
if (!limit) {
  throw new Error('TODOIST limit is not set in the environment variables');
}
describe('TODOIST API', () => {
  let api: TodoistApi;
  let config: ITodoistConfig;
  beforeEach((): void => {
    config = {
      token: token,
      limit: parseInt(limit) || 100,
    };
    api = new TodoistApi(config);
  });

  afterEach(async (): Promise<void> => {
    jest.restoreAllMocks();
  });

  it('getAllProjects', async (): Promise<void> => {
    const projects: ITodoistProject[] = await api.getAllProjects();
    expect(projects[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
      }),
    );
  });

  describe('getAllProjects Pagination', () => {
    it('should iterate over all projects and fetching all pages', async (): Promise<void> => {
      const getStoriesSpy = jest.spyOn(api, 'getProjects');
      const getNextSpy = jest.spyOn(api, 'getNextProjects');
      const allEntities = await api.getAllProjects();

      const expectedGetNextCallsCount = Math.ceil(allEntities.length / config.limit) - 1;
      expect(getStoriesSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedGetNextCallsCount);
      expect(allEntities.length).toEqual(3);
      jest.restoreAllMocks();
    });
  });
});
