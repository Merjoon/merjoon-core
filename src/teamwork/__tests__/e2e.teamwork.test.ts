import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../../common/types';
import { TeamworkService } from '../service';
import { ID_REGEX } from '../../utils/regex';
import { getTeamworkService } from '../teamwork-service';

describe('e2e TeamWork', () => {
  let service: TeamworkService;

  beforeEach(() => {
    service = getTeamworkService();
  });

  it('getUsers', async () => {
    const users: IMerjoonUsers = await service.getUsers();

    expect(Object.keys(users[0])).toEqual(expect.arrayContaining([
      'id',
      'remote_id',
      'name',
      'email_address',
      'remote_created_at',
      'remote_modified_at',
      'created_at',
      'modified_at',
    ]));

    expect(users[0]).toEqual({
      id: expect.stringMatching(ID_REGEX),
      remote_id: expect.any(String),
      name: expect.any(String),
      email_address: expect.any(String),
      remote_created_at: expect.any(Number),
      remote_modified_at: expect.any(Number),
      created_at: expect.any(Number),
      modified_at: expect.any(Number),
    });
  });

  it('getProjects', async () => {
    const projects: IMerjoonProjects = await service.getProjects();

    expect(Object.keys(projects[0])).toEqual(expect.arrayContaining([
      'id',
      'remote_id',
      'name',
      'description',
      'remote_created_at',
      'remote_modified_at',
      'created_at',
      'modified_at',
    ]));

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

  it('getTasks', async () => {
    await service.getProjects();
    const tasks: IMerjoonTasks = await service.getTasks();
    expect(Object.keys(tasks[0])).toEqual(expect.arrayContaining([
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
    ]));

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
    });
  });

  it('checkReferences', async () => {
    const [users, projects, tasks] = await Promise.all([
      service.getUsers(),
      service.getProjects(),
      service.getTasks(),
    ]);

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