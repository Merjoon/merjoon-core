import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../../common/types';
import { gitLabService } from '../service';
import { getGitLabService } from '../gitlab_service';
import { ID_REGEX } from '../../utils/regex';

describe('GitLab Service', () => {
  let service: gitLabService;

  beforeEach(async () => {
    service = getGitLabService();
  });
  describe('getUsers', () => {
    it('should return a valid user structure', async () => {
      const users: IMerjoonUsers = await service.getUsers();
      expect(Object.keys(users[0])).toEqual(expect.objectContaining([
        'id',
        'remote_id',
        'name',
      ]));
      expect(users[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(Number),
        name: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
      });
    },5000);
  });

  describe('getTasks', () => {
    it('should return a valid Tasks structure', async () => {
      const tasks: IMerjoonTasks = await service.getTasks();
      expect(Object.keys(tasks[0])).toEqual(expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'assignees',
        'status',
        'description',
        'remote_created_at',
        'remote_modified_at',
        'ticket_url',
      ]));
      expect(tasks[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(Number),
        name: expect.any(String),
        assignees: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        modified_at: expect.any(Number),
        status: expect.any(String),
        description: expect.any(String),
        remote_created_at: expect.any(String),
        remote_modified_at: expect.any(String),
        ticket_url: expect.any(String),
        created_at: expect.any(Number),
        projects: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
      });
    },);
  });

  describe('getProjects', () => {
    it('should return a valid projects structure', async () => {
      const projects: IMerjoonProjects = await service.getProjects();
      expect(Object.keys(projects[0])).toEqual(expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'remote_created_at',
        'description',
        'remote_modified_at',
        'modified_at',
      ]));
      expect(projects[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(Number),
        name: expect.any(String),
        remote_created_at: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        remote_modified_at: expect.any(String),
        description: expect.any(String),
      });
    },);
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