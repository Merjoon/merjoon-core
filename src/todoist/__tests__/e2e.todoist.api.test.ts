import { TodoistApi } from '../api';
import { ITodoistConfig } from '../types';

const token = process.env.TODOIST_TOKEN;
if (!token) {
  throw new Error('TODOIST token is not set in the environment variables');
}

describe('TODOIST API', () => {
  let api: TodoistApi;
  let config: ITodoistConfig;
  beforeEach(async () => {
    config = {
      token,
      limit: 1,
    };
    api = new TodoistApi(config);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('getAllProjects', () => {
    it('should return all projects', async () => {
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

  describe('getAllCollaborators', () => {
    let project_id: string;
    it('should return all collaborators', async () => {
      const projects = await api.getAllProjects();
      project_id = projects[1].id;
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const users = await api.getAllCollaborators(project_id);
      expect(users.length).toBeGreaterThan(0);
      expect(users[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
        }),
      );
      const totalPagesCalledCount = Math.ceil(users.length / config.limit);
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(1);
    });
  });
});
