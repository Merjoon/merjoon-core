import { TodoistApi } from '../api';
import type {
  ITodoistConfig,
  ITodoistProject, ITodoistResponse,
  ITodoistUser,
} from '../types';

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
  let realProjectId: string;

  beforeAll(async (): Promise<void> => {
    config = {
      token,
      limit: parseInt(limit) || 100,
    };
    api = new TodoistApi(config);

    const projects: ITodoistProject[] = await api.getAllProjects();
    if (!projects.length) {
      throw new Error('No projects found to test with');
    }
    realProjectId = projects[0].id;
  });

  afterEach(async (): Promise<void> => {
    jest.restoreAllMocks();
  });

  describe('getProjectUsers', () => {
    it('should fetch users (collaborators) of a project', async (): Promise<void> => {
      const response: ITodoistResponse<ITodoistUser> = await api.getProjectUsers(realProjectId);

      expect(Array.isArray(response.results)).toBe(true);
      if (response.results.length > 0) {
        expect(response.results[0]).toEqual(
          expect.objectContaining<Partial<ITodoistUser>>({
            id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
          }),
        );
      }
    });
  });

  describe('getAllProjectUsers with pagination', () => {
    it('should fetch all users using cursor pagination', async (): Promise<void> => {
      const getUsersSpy = jest.spyOn(api, 'getProjectUsers');
      const allUsers: ITodoistUser[] = await api.getAllProjectUsers(realProjectId);

      expect(Array.isArray(allUsers)).toBe(true);

      if (allUsers.length > 0) {
        expect(allUsers[0]).toEqual(
          expect.objectContaining<Partial<ITodoistUser>>({
            id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
          }),
        );
      }

      expect(getUsersSpy).toHaveBeenCalled();
    });
  });
});
