import { GithubIssuesService } from '../service';
import { getGithubIssuesService } from '../githubIssues-service';
import { ID_REGEX } from '../../utils/regex';

describe('e2e github issues', () => {
  let service: GithubIssuesService;

  beforeEach(async () => {
    service = getGithubIssuesService();
    await service.init();
  });
  it('getUsers', async () => {
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
  it('getProjects', async () => {
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
  it('getTasks', async () => {
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
  it('checkReferences', async () => {
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
