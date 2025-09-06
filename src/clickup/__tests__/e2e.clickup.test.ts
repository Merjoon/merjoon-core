jest.setTimeout(15000);
import { ClickUpService } from '../service';
import { getClickUpService } from '../clickup-service';
import { ID_REGEX } from '../../utils/regex';

describe('e2e ClickUp', () => {
  let service: ClickUpService;
  beforeEach(() => {
    service = getClickUpService();
  });

  describe('getUsers', () => {
    it('getUsers succeeded', async () => {
      const users = await service.getUsers();

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
      const projects = await service.getProjects();

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

  describe('getComments', () => {
    it('getComments succeeded', async () => {
      await service.getUsers();
      await service.getProjects();
      await service.getTasks();
      const comments = await service.getComments();
      expect(Object.keys(comments[0])).toEqual(
        expect.arrayContaining([
          'id',
          'remote_id',
          'user_id',
          'remote_created_at',
          'created_at',
          'modified_at',
          'body',
          'task_id',
        ]),
      );

      expect(comments[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        user_id: expect.stringMatching(ID_REGEX),
        remote_created_at: expect.any(Number),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        body: expect.any(String),
        task_id: expect.stringMatching(ID_REGEX),
      });
    });

    it('getAllComments failed with "Task IDs not found" error', async () => {
      await expect(service.getAllComments()).rejects.toThrow('Task IDs not found');
    });
  });

  describe('getTasks', () => {
    it('getTasks succeeded', async () => {
      await service.getUsers();
      await service.getProjects();
      const tasks = await service.getTasks();

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
      const users = await service.getUsers();
      const projects = await service.getProjects();
      const tasks = await service.getTasks();
      const comments = await service.getComments();

      for (const task of tasks) {
        const assigneeIds = task.assignees.map((assignee) => assignee);
        const userIds = users.map((user) => user.id);
        expect(userIds).toEqual(expect.arrayContaining(assigneeIds));

        const taskProjectIds = task.projects.map((project) => project);
        const projectIds = projects.map((proj) => proj.id);
        expect(projectIds).toEqual(expect.arrayContaining(taskProjectIds));
      }

      const commentTaskIds = comments.map((comment) => comment.task_id);
      const taskIds = tasks.map((task) => task.id);
      expect(taskIds).toEqual(expect.arrayContaining(commentTaskIds));
    });
  });
});
