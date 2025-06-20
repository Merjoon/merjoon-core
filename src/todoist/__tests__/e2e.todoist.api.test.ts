import { TodoistApi } from '../api';
import { ITodoistConfig } from '../types';

const token = process.env.TODOIST_TOKEN;
if (!token) {
  throw new Error('TODOIST token is not set in the environment variables');
}

describe('TODOIST API', () => {
  let api: TodoistApi;
  let config: ITodoistConfig;

  beforeEach(() => {
    config = {
      token,
      limit: 1,
    };
    api = new TodoistApi(config);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('getAllProjects', async () => {
    const getRecordsSpy = jest.spyOn(api, 'getRecords');
    const projects = await api.getAllProjects();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
      }),
    );
    const totalPagesCalledCount = Math.ceil(projects.length / config.limit);
    expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
    expect(totalPagesCalledCount).toBeGreaterThan(1);
  });
});
