import { ID_REGEX } from '../../utils/regex';
import { getHeightService } from '../height-service';
import { HeightService } from '../service';

describe('e2e Height', () => {
  let service: HeightService;

  beforeEach(async () => {
    service = getHeightService();
  });

  it('getUsers', async () => {
    const users = await service.getUsers();
    expect(Object.keys(users[0])).toEqual(
      expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'email_address',
        'remote_created_at',
        'remote_modified_at',
        'created_at',
        'modified_at',
      ])
    );

    expect(users[0]).toEqual({
      id: expect.any(String),
      remote_id: expect.any(String),
      name: expect.any(String),
      email_address: expect.any(String),
      remote_created_at: expect.any(String),
      remote_modified_at: expect.any(String),
      created_at: expect.any(Number),
      modified_at: expect.any(Number),
    });
  });

  it('getProjects', async () => {
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
      ])
    );

    expect(projects[0]).toEqual({
      id: expect.stringMatching(ID_REGEX),
      remote_id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      remote_created_at: expect.any(String),
      remote_modified_at: expect.any(String),
      created_at: expect.any(Number),
      modified_at: expect.any(Number),
    });
  });

  it('getTasks', async () => {
    const tasks = await service.getTasks();
    expect(Object.keys(tasks[0])).toEqual(
      expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'status',
        'description',
        'remote_created_at',
        'remote_modified_at',
        'assignees',
        'projects',
        'ticket_url',
        'created_at',
        'modified_at',
      ])
    );

    expect(tasks[0]).toEqual({
      id: expect.any(String),
      remote_id: expect.any(String),
      name: expect.any(String),
      status: expect.any(String),
      description: expect.any(String),
      remote_created_at: expect.any(String),
      remote_modified_at: expect.any(String),
      assignees: expect.arrayContaining([]),
      projects: expect.arrayContaining([]),
      ticket_url: expect.any(String),
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


    tasks.forEach((task) => {
      const assigneeIds = task.assignees.map((assignee) => assignee);
      const userIds = users.map((user) => user.id);
      expect(userIds).toEqual(expect.arrayContaining(assigneeIds));

      const taskProjectIds = task.projects.map((project) => project);
      const projectIds = projects.map((proj) => proj.id);
      expect(projectIds).toEqual(expect.arrayContaining(taskProjectIds));
    });
  });
});
