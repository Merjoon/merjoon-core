import { GitLabService } from '../service';
import { getGitLabService } from '../gitlab-service';
import { ID_REGEX } from '../../utils/regex';

describe('GitLab Service', () => {
  let service: GitLabService;

  beforeEach(async () => {
    service = getGitLabService();
  });
  describe('getUsers', () => {
    it('should return a valid user structure', async () => {
      const users = await service.getUsers();
      expect(Object.keys(users[0])).toEqual(expect.objectContaining(['id', 'remote_id', 'name']));
      expect(users[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(Number),
        name: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
      });
    });
  });

  describe('getTasks', () => {
    it('should return a valid Tasks structure', async () => {
      const tasks = await service.getTasks();
      expect(Object.keys(tasks[0])).toEqual(
        expect.arrayContaining([
          'id',
          'remote_id',
          'name',
          'assignees',
          'status',
          'description',
          'remote_modified_at',
          'remote_created_at',
          'ticket_url',
          'projects',
          'created_at',
          'modified_at',
        ]),
      );
      expect(tasks[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(Number),
        name: expect.any(String),
        assignees: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        modified_at: expect.any(Number),
        status: expect.any(String),
        description: expect.any(String),
        remote_modified_at: expect.any(Number),
        ticket_url: expect.any(String),
        created_at: expect.any(Number),
        remote_created_at: expect.any(Number),
        projects: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
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
          'remote_created_at',
          'description',
          'remote_modified_at',
          'modified_at',
        ]),
      );
      expect(projects[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(Number),
        name: expect.any(String),
        remote_created_at: expect.any(Number),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        remote_modified_at: expect.any(Number),
        description: expect.any(String),
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
