import { TodoistService } from '../service';
import { getTodoistService } from '../todoist-service';
import { ID_REGEX } from '../../utils/regex';

describe('e2e Todoist', () => {
  let service: TodoistService;

  beforeEach(async () => {
    service = getTodoistService();
    await service.init();
  });

  it('getProjects', async () => {
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

  it('getUsers', async () => {
    await service.getProjects();
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

  it('getTasks', async () => {
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
    });
  });

  it('checkReferences', async () => {
    const projects = await service.getProjects();
    const tasks = await service.getTasks();
    const users = await service.getUsers();

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
