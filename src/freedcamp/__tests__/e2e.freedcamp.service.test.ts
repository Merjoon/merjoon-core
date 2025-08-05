import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../../common/types';
import { FreedcampService } from '../service';
import { getFreedcampService } from '../freedcamp-service';
import { ID_REGEX } from '../../utils/regex';
import { IFreedcampTask } from '../types';

describe('e2e Freedcamp service', () => {
  let service: FreedcampService;
  beforeEach(async () => {
    service = getFreedcampService();
    await service.init();
  });
  it('getUsers', async () => {
    const users: IMerjoonUsers = await service.getUsers();
    expect(Object.keys(users[0])).toEqual(
      expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'created_at',
        'modified_at',
        'email_address',
      ]),
    );

    expect(users[0]).toEqual({
      id: expect.stringMatching(ID_REGEX),
      remote_id: expect.any(String),
      name: expect.any(String),
      created_at: expect.any(Number),
      modified_at: expect.any(Number),
      email_address: expect.any(String),
    });
  });

  it('getProjects', async () => {
    const projects: IMerjoonProjects = await service.getProjects();

    expect(Object.keys(projects[0])).toEqual(
      expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'created_at',
        'modified_at',
        'description',
        'remote_created_at',
      ]),
    );

    expect(projects[0]).toEqual({
      id: expect.stringMatching(ID_REGEX),
      remote_id: expect.any(String),
      name: expect.any(String),
      created_at: expect.any(Number),
      modified_at: expect.any(Number),
      description: expect.any(String),
      remote_created_at: expect.any(Number),
    });
  });

  it('getTasks', async () => {
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

  it('should clear assigneeIds if it contains only "0"', async () => {
    const task: IFreedcampTask = {
      id: '62784728',
      title: 'Task2',
      status_title: 'In Progress',
      assigned_ids: ['0'],
      project_id: '3639d98ff2b3a5d1eda110dea4a6bd83',
      description: 'Very important task',
      created_ts: 1754398440434,
      updated_ts: 1754398440434,
      url: 'https://freedcamp.com/view/3543358/tasks/62784728',
    };
    FreedcampService.normalizeAssignedIds(task);
    expect(task.assigned_ids).toEqual([]);
  });

  it('checkReferences', async () => {
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
