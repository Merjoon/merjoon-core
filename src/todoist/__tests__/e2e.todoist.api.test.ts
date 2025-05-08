import { TodoistApi } from '../api';
import { ITodoistConfig } from '../types';

const token = process.env.TODOIST_TOKEN;

if (!token) {
  throw new Error('Todoist token is not set in the environment variables');
}

describe('Todoist Api', () => {
  let api: TodoistApi;
  let config: ITodoistConfig;

  beforeEach(async () => {
    config = {
      token: token,
    };
    api = new TodoistApi(config);
  });
  describe('getProjects', () => {
    it('should get all projects', async () => {
      const projects = await api.getProjects();
      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      );
    });
  });
});
