import { TrelloService } from '../service';
import { getTrelloService } from '../trello-service';
import { ID_REGEX } from '../../utils/regex';

describe('e2e Trello Service', () => {
  let service: TrelloService;

  beforeEach(async () => {
    service = getTrelloService();
  });

  describe('getProjects', () => {
    it('should get projects', async () => {
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
        remote_id: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
      });
    });

    it('should throw error when organizationIds are missing', async () => {
      await expect(service.getProjects()).rejects.toThrow('No organizationIds found');
    });
  });

  describe('getUsers', () => {
    it('should get users', async () => {
      await service.init();
      const users = await service.getUsers();
      expect(Object.keys(users[0])).toEqual(
        expect.arrayContaining(['id', 'remote_id', 'name', 'created_at', 'modified_at']),
      );

      expect(users[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        name: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
      });
    });

    it('should throw error when organizationIds are missing', async () => {
      await expect(service.getUsers()).rejects.toThrow('No organizationIds found');
    });
  });

  describe('getTasks', () => {
    it('should get tasks', async () => {
      await service.init();
      await service.getProjects();
      const tasks = await service.getTasks();
      expect(Object.keys(tasks[0])).toEqual(
        expect.arrayContaining([
          'id',
          'created_at',
          'modified_at',
          'remote_id',
          'name',
          'assignees',
          'status',
          'description',
          'projects',
          'ticket_url',
        ]),
      );

      expect(tasks[0].assignees.length).toBeGreaterThan(0);
      expect(tasks[0].projects.length).toBeGreaterThan(0);

      expect(tasks[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        name: expect.any(String),
        assignees: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        status: expect.any(String),
        description: expect.any(String),
        projects: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        ticket_url: expect.any(String),
      });
    });

    it('should throw error when boardIds or lists are missing', async () => {
      await expect(service.getTasks()).rejects.toThrow('No boardIds or lists found');
    });
  });

  describe('checkReferences', () => {
    it('checkReferences', async () => {
      await service.init();
      const projects = await service.getProjects();
      const users = await service.getUsers();
      const tasks = await service.getTasks();

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
