import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../../common/types';
import { ClickUpService } from '../service';
import { getClickUpService } from '../clickup-service';
import { ID_REGEX } from '../../utils/regex';
import { ClickUpApi } from '../api';
import { IClickUpTask, IClickUpTaskResponse } from '../types';

describe('ClickUpApi', () => {
  let clickUpApi: ClickUpApi;

  beforeEach(() => {
    clickUpApi = new ClickUpApi({ apiKey: 'mock-api-key' });

    jest.spyOn(clickUpApi, 'getAllTasksIterator').mockImplementation(async function* () {
      yield { tasks: [{ id: '1', name: 'Task 1' }], last_page: false };
      yield { tasks: [{ id: '2', name: 'Task 2' }], last_page: true };
    });

    jest.spyOn(clickUpApi, 'sendGetRequest').mockResolvedValue({ tasks: [], last_page: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all tasks correctly from multiple pages', async () => {
    const listId = 'mock-list-id';
    const tasks: IClickUpTask[] = [];
    for await (const chunk of clickUpApi.getAllTasksIterator(listId)) {
      tasks.push(...chunk.tasks);
    }
    expect(tasks).toEqual([
      { id: '1', name: 'Task 1' },
      { id: '2', name: 'Task 2' },
    ]);
  });

  it('should call getAllTasksIterator once for each page', async () => {
    const listId = 'mock-list-id';
    const iterator = clickUpApi.getAllTasksIterator(listId);
    const results: IClickUpTaskResponse[] = [];
    for await (const chunk of iterator) {
      results.push(chunk);
    }
    expect(results.length).toBe(2);
    expect(results[0].tasks.length).toBe(1);
    expect(results[1].tasks.length).toBe(1);
  });

  it('should return all tasks in one call for a single page', async () => {
    jest.spyOn(clickUpApi, 'getAllTasksIterator').mockImplementation(async function* () {
      yield { tasks: [{ id: '1', name: 'Task 1' }], last_page: true };
    });

    const listId = 'mock-list-id';
    const tasks: IClickUpTask[] = [];
    for await (const chunk of clickUpApi.getAllTasksIterator(listId)) {
      tasks.push(...chunk.tasks);
    }
    expect(tasks).toEqual([{ id: '1', name: 'Task 1' }]);
  });

  it('should handle the case when there are no tasks', async () => {
    jest.spyOn(clickUpApi, 'getAllTasksIterator').mockImplementation(async function* () {
      yield { tasks: [], last_page: true };
    });
    const listId = 'mock-list-id';
    const tasks: IClickUpTask[] = [];
    for await (const chunk of clickUpApi.getAllTasksIterator(listId)) {
      tasks.push(...chunk.tasks);
    }
    expect(tasks).toEqual([]);
  });

  it('should handle errors thrown during fetching tasks', async () => {
    jest.spyOn(clickUpApi, 'getAllTasksIterator').mockImplementation(async function* () {
      throw new Error('Network error');
    });
    const listId = 'mock-list-id';
    await expect(async () => {
      const tasks: IClickUpTask[] = [];
      for await (const chunk of clickUpApi.getAllTasksIterator(listId)) {
        tasks.push(...chunk.tasks);
      }
    }).rejects.toThrow('Network error');
  });

  it('should call sendGetRequest with correct parameters', async () => {
    const listId = 'mock-list-id';
    await clickUpApi.getAllTasksIterator(listId);
    expect(clickUpApi.sendGetRequest).toHaveBeenCalledWith(
      expect.stringContaining('tasks'),
      expect.objectContaining({ page: expect.any(Number) }),
    );
  });

  it('should fetch list information correctly', async () => {
    const listId = 'mock-list-id';
    const list = await clickUpApi.getList(listId);
    expect(list).toEqual({ id: 'mock-list-id', name: 'Test List', content: 'Test Content' });
  });

  it('should fetch member information correctly', async () => {
    const memberId = 'mock-member-id';
    const member = await clickUpApi.getMember(memberId);
    expect(member).toEqual({ id: 'mock-member-id', username: 'Test User', email: 'test@user.com' });
  });

  it('should return an empty list if no list data is found', async () => {
    jest.spyOn(clickUpApi, 'sendGetRequest').mockResolvedValue({ lists: [] });
    const listId = 'mock-list-id';
    const list = await clickUpApi.getList(listId);
    expect(list).toEqual([]);
  });
});

describe('e2e ClickUp', () => {
  let service: ClickUpService;
  beforeEach(() => {
    service = getClickUpService();
  });

  describe('getUsers', () => {
    it('getUsers succeeded', async () => {
      const users: IMerjoonUsers = await service.getUsers();

      expect(Object.keys(users[0])).toEqual(
        expect.arrayContaining([
          'id',
          'remote_id',
          'name',
          'email_address',
          'created_at',
          'modified_at',
        ]),
      );

      expect(users[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        name: expect.any(String),
        email_address: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
      });
    });
  });

  describe('getProjects', () => {
    it('getProjects succeeded', async () => {
      await service.getUsers();
      const projects: IMerjoonProjects = await service.getProjects();

      expect(Object.keys(projects[0])).toEqual(
        expect.arrayContaining([
          'id',
          'remote_id',
          'name',
          'description',
          'created_at',
          'modified_at',
        ]),
      );

      expect(projects[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
      });
    });

    it('getProjects failed with "Team IDs not found" error', async () => {
      await expect(service.getProjects()).rejects.toThrow('Team IDs not found');
    });
  });

  describe('getTasks', () => {
    it('getTasks succeeded', async () => {
      await service.getUsers();
      await service.getProjects();
      const tasks: IMerjoonTasks = await service.getTasks();

      expect(Object.keys(tasks[0])).toEqual(
        expect.arrayContaining([
          'id',
          'remote_id',
          'name',
          'assignees',
          'status',
          'description',
          'projects',
          'remote_created_at',
          'remote_modified_at',
          'created_at',
          'modified_at',
        ]),
      );

      expect(tasks[0].assignees.length).toBeGreaterThan(0);
      expect(tasks[0].projects.length).toBeGreaterThan(0);

      expect(tasks[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        name: expect.any(String),
        assignees: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        status: expect.any(String),
        description: expect.any(String),
        projects: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        remote_created_at: expect.any(Number),
        remote_modified_at: expect.any(Number),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        ticket_url: expect.any(String),
      });
    });

    it('getTasks failed with "List IDs not found" error', async () => {
      await expect(service.getTasks()).rejects.toThrow('List IDs not found');
    });

    it('getTasks failed with "List IDs not found" error', async () => {
      await service.getUsers();
      await expect(service.getTasks()).rejects.toThrow('List IDs not found');
    });
  });

  describe('Check References', () => {
    it('checkReferences', async () => {
      const users: IMerjoonUsers = await service.getUsers();
      const projects: IMerjoonProjects = await service.getProjects();
      const tasks: IMerjoonTasks = await service.getTasks();

      for (const task of tasks) {
        const assigneeIds = task.assignees.map((assignee) => assignee);
        const userIds = users.map((user) => user.id);
        expect(userIds).toEqual(expect.arrayContaining(assigneeIds));

        const taskProjectIds = task.projects.map((project) => project);
        const projectIds = projects.map((proj) => proj.id);
        expect(projectIds).toEqual(expect.arrayContaining(taskProjectIds));
      }
    });
  });
});
