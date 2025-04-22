import { MeisterService } from '../service';
import { getMeisterService } from '../meister-service';
import { ID_REGEX } from '../../utils/regex';

describe('MeisterService', () => {
  let service: MeisterService;
  beforeEach(async () => {
    service = getMeisterService();
  });
  describe('getTasks', () => {
    it('should return a valid tasks structure', async () => {
      const tasks = await service.getTasks();
      expect(Object.keys(tasks[0])).toEqual(
        expect.arrayContaining([
          'id',
          'name',
          'assignees',
          'description',
          'projects',
          'status',
          'created_at',
          'modified_at',
          'remote_modified_at',
          'remote_created_at',
          'remote_id',
        ]),
      );
      expect(tasks[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        status: expect.any(String),
        assignees: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        description: expect.any(String),
        projects: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        remote_modified_at: expect.any(Number),
        remote_created_at: expect.any(Number),
        name: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
      });
    });
  });
  describe('getUsers', () => {
    it('should return a valid users structure', async () => {
      const users = await service.getUsers();
      expect(Object.keys(users[0])).toEqual(
        expect.arrayContaining([
          'id',
          'remote_id',
          'name',
          'email_address',
          'created_at',
          'modified_at',
          'remote_created_at',
          'remote_modified_at',
        ]),
      );
      expect(users[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        name: expect.any(String),
        email_address: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        remote_modified_at: expect.any(Number),
        remote_created_at: expect.any(Number),
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
  describe('Check References', () => {
    it('checkReferences', async () => {
      const users = await service.getUsers();
      const projects = await service.getProjects();
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
