import { TodoistApi } from '../api';
import { ITodoistConfig } from '../types';

const token = process.env.TODOIST_TOKEN;
if (!token) {
  throw new Error('TODOIST token is not set in the environment variables');
}

describe('TODOIST API', () => {
  let api: TodoistApi;
  let config: ITodoistConfig;
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('getAllProjects', () => {
    beforeEach(async () => {
      config = {
        token,
        maxSockets: 10,
        limit: 1,
      };
      api = new TodoistApi(config);
    });
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
    beforeEach(async () => {
      config = {
        token,
        maxSockets: 10,
        limit: 2,
      };
      api = new TodoistApi(config);
    });
    let project_id: string;
    it('should return all collaborators', async () => {
      const projects = await api.getAllProjects();
      project_id = projects[1].id;
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const collaborators = await api.getAllCollaborators(project_id);
      expect(collaborators.length).toBeGreaterThan(0);
      expect(collaborators[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
        }),
      );
      const totalPagesCalledCount = Math.ceil(collaborators.length / config.limit);
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(1);
    });
  });
  describe('getAllTasks', () => {
    beforeEach(async () => {
      config = {
        token,
        maxSockets: 10,
        limit: 17,
      };
      api = new TodoistApi(config);
    });
    it('should return all tasks', async () => {
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const tasks = await api.getAllTasks();
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          content: expect.any(String),
          description: expect.any(String),
          section_id: expect.any(String),
          project_id: expect.any(String),
          assigned_by_uid: expect.any(String),
          added_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      );
      const totalPagesCalledCount = Math.ceil(tasks.length / config.limit);
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(1);
    });
  });
  describe('getAllSections', () => {
    beforeEach(async () => {
      config = {
        token,
        maxSockets: 10,
        limit: 7,
      };
      api = new TodoistApi(config);
    });
    it('should return all sections', async () => {
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const sections = await api.getAllSections();
      expect(sections.length).toBeGreaterThan(0);
      expect(sections[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      );
      const totalPagesCalledCount = Math.ceil(sections.length / config.limit);
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(1);
    });
  });
});
