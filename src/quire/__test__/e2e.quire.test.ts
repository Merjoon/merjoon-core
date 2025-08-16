import { getQuireService } from '../quire-service';
import { QuireService } from '../service';
import { ID_REGEX } from '../../utils/regex';

describe('e2e Quire', () => {
  let service: QuireService;

  beforeEach(async () => {
    service = await getQuireService();
  });

  describe('getUsers', () => {
    it('should return a valid user structure', async () => {
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
    it('should return a valid projects structure', async () => {
      const projects = await service.getProjects();

      expect(Object.keys(projects[0])).toEqual(
        expect.arrayContaining([
          'id',
          'remote_id',
          'name',
          'description',
          'remote_created_at',
          'remote_modified_at',
          'created_at',
          'modified_at',
        ]),
      );

      expect(projects[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        remote_created_at: expect.any(Number),
        remote_modified_at: expect.any(Number),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
      });
    });
  });

  describe('getTasks', () => {
    it('should return a valid task structure', async () => {
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
          'ticket_url',
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

    it('should throw an error when projects are not defined', async () => {
      await expect(service.getTasks()).rejects.toThrow('No projectIds provided.');
    });
  });

  describe('checkReferences', () => {
    it('should validate reference integrity between tasks and projects', async () => {
      const projects = await service.getProjects();
      const tasks = await service.getTasks();
      for (const task of tasks) {
        const taskProjectIds = task.projects.map((project) => project);
        const projectIds = projects.map((proj) => proj.id);
        expect(projectIds).toEqual(expect.arrayContaining(taskProjectIds));
      }
    });
  });
});
