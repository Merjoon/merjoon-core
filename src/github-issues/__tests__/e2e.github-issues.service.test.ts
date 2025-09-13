import { GithubIssuesService } from '../service';
import { getGithubIssuesService } from '../github-issues-service';
import { ID_REGEX } from '../../utils/regex';

describe('e2e github issues', () => {
  let service: GithubIssuesService;

  beforeEach(async () => {
    service = getGithubIssuesService();
  });

  describe('getUsers', () => {
    it('getUsers failed with "Missing organization" error', async () => {
      await expect(service.getUsers()).rejects.toThrow('Missing organization');
    });

    it('getUsers', async () => {
      await service.init();
      const users = await service.getUsers();
      expect(Object.keys(users[0])).toEqual(
        expect.arrayContaining(['id', 'remote_id', 'name', 'created_at', 'modified_at']),
      );

      expect(users[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(Number),
        name: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
      });
    });
  });

  describe('getProjects', () => {
    it('getProjects failed with "Missing organization" error', async () => {
      await expect(service.getProjects()).rejects.toThrow('Missing organization');
    });

    it('getProjects', async () => {
      await service.init();
      const projects = await service.getProjects();
      expect(Object.keys(projects[0])).toEqual(
        expect.arrayContaining([
          'id',
          'remote_id',
          'name',
          'created_at',
          'modified_at',
          'description',
        ]),
      );

      expect(projects[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(Number),
        name: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        description: expect.any(String),
        remote_modified_at: expect.any(Number),
        remote_created_at: expect.any(Number),
      });
    });
  });

  describe('getTasks', () => {
    it('getTasks failed with "Missing repository owner and name" error', async () => {
      await expect(service.getTasks()).rejects.toThrow('Missing repository owner and name');
    });

    it('should return a valid task structure', async () => {
      await service.init();
      await service.getProjects();
      const tasks = await service.getTasks();

      expect(Object.keys(tasks[0])).toEqual(
        expect.arrayContaining([
          'id',
          'remote_id',
          'name',
          'created_at',
          'modified_at',
          'description',
          'assignees',
          'status',
          'remote_created_at',
          'remote_modified_at',
          'ticket_url',
          'projects',
        ]),
      );

      expect(tasks[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(Number),
        name: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        description: expect.any(String),
        status: expect.any(String),
        remote_modified_at: expect.any(Number),
        remote_created_at: expect.any(Number),
        ticket_url: expect.any(String),
        assignees: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        projects: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
      });
    });
  });

  describe('checkReferences', () => {
    it('checkReferences', async () => {
      await service.init();
      await service.getProjects();
      const users = await service.getUsers();
      const tasks = await service.getTasks();
      for (const task of tasks) {
        const assigneeIds = task.assignees.map((assignee) => assignee);
        const userIds = users.map((user) => user.id);
        expect(userIds).toEqual(expect.arrayContaining(assigneeIds));
        const projectIds = tasks.map((task) => task.projects[0]);
        const taskIds = tasks.map((task) => task.id);
        expect(taskIds).toEqual(projectIds);
      }
    });
  });
});
