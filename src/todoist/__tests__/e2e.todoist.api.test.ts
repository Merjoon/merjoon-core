import { TodoistApi } from '../api';
import { ITodoistConfig, ITodoistProject } from '../types';
const token: string | undefined = process.env.TODOIST_TOKEN;
if (!token) {
  throw new Error('TODOIST token is not set in the environment variables');
}
describe('TODOIST API', () => {
  let api: TodoistApi;
  let config: ITodoistConfig;
  beforeEach((): void => {
    config = {
      token: token,
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
});
