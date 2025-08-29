import { GithubIssuesService } from '../service';
import { getGithubIssuesService } from '../github-issues-service';
import { ID_REGEX } from '../../utils/regex';

describe('e2e github issues', () => {
  let service: GithubIssuesService;

  beforeEach(async () => {
    service = getGithubIssuesService();
  });

  describe('getUniqueMembers', () => {
    it('should return member unique', async () => {
      await service.init();
      const members = [
        {
          login: 'merjoontest1',
          id: 179820065,
          node_id: 'U_kgDOCrfWIQ',
          avatar_url: 'https://avatars.githubusercontent.com/u/179820065?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/merjoontest1',
          html_url: 'https://github.com/merjoontest1',
          followers_url: 'https://api.github.com/users/merjoontest1/followers',
          following_url: 'https://api.github.com/users/merjoontest1/following{/other_user}',
          gists_url: 'https://api.github.com/users/merjoontest1/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/merjoontest1/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/merjoontest1/subscriptions',
          organizations_url: 'https://api.github.com/users/merjoontest1/orgs',
          repos_url: 'https://api.github.com/users/merjoontest1/repos',
          events_url: 'https://api.github.com/users/merjoontest1/events{/privacy}',
          received_events_url: 'https://api.github.com/users/merjoontest1/received_events',
          type: 'User',
          user_view_type: 'public',
          site_admin: false,
        },
        {
          login: 'merjoontest22',
          id: 185327983,
          node_id: 'U_kgDOCwvhbw',
          avatar_url: 'https://avatars.githubusercontent.com/u/185327983?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/merjoontest22',
          html_url: 'https://github.com/merjoontest22',
          followers_url: 'https://api.github.com/users/merjoontest22/followers',
          following_url: 'https://api.github.com/users/merjoontest22/following{/other_user}',
          gists_url: 'https://api.github.com/users/merjoontest22/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/merjoontest22/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/merjoontest22/subscriptions',
          organizations_url: 'https://api.github.com/users/merjoontest22/orgs',
          repos_url: 'https://api.github.com/users/merjoontest22/repos',
          events_url: 'https://api.github.com/users/merjoontest22/events{/privacy}',
          received_events_url: 'https://api.github.com/users/merjoontest22/received_events',
          type: 'User',
          user_view_type: 'public',
          site_admin: false,
        },
        {
          login: 'merjoontest1',
          id: 179820065,
          node_id: 'U_kgDOCrfWIQ',
          avatar_url: 'https://avatars.githubusercontent.com/u/179820065?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/merjoontest1',
          html_url: 'https://github.com/merjoontest1',
          followers_url: 'https://api.github.com/users/merjoontest1/followers',
          following_url: 'https://api.github.com/users/merjoontest1/following{/other_user}',
          gists_url: 'https://api.github.com/users/merjoontest1/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/merjoontest1/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/merjoontest1/subscriptions',
          organizations_url: 'https://api.github.com/users/merjoontest1/orgs',
          repos_url: 'https://api.github.com/users/merjoontest1/repos',
          events_url: 'https://api.github.com/users/merjoontest1/events{/privacy}',
          received_events_url: 'https://api.github.com/users/merjoontest1/received_events',
          type: 'User',
          user_view_type: 'public',
          site_admin: false,
        },
      ];
      const uniqueMembers = GithubIssuesService.getUniqueMembers(members);
      expect(uniqueMembers).toEqual([
        {
          login: 'merjoontest1',
          id: 179820065,
          node_id: 'U_kgDOCrfWIQ',
          avatar_url: 'https://avatars.githubusercontent.com/u/179820065?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/merjoontest1',
          html_url: 'https://github.com/merjoontest1',
          followers_url: 'https://api.github.com/users/merjoontest1/followers',
          following_url: 'https://api.github.com/users/merjoontest1/following{/other_user}',
          gists_url: 'https://api.github.com/users/merjoontest1/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/merjoontest1/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/merjoontest1/subscriptions',
          organizations_url: 'https://api.github.com/users/merjoontest1/orgs',
          repos_url: 'https://api.github.com/users/merjoontest1/repos',
          events_url: 'https://api.github.com/users/merjoontest1/events{/privacy}',
          received_events_url: 'https://api.github.com/users/merjoontest1/received_events',
          type: 'User',
          user_view_type: 'public',
          site_admin: false,
        },
        {
          login: 'merjoontest22',
          id: 185327983,
          node_id: 'U_kgDOCwvhbw',
          avatar_url: 'https://avatars.githubusercontent.com/u/185327983?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/merjoontest22',
          html_url: 'https://github.com/merjoontest22',
          followers_url: 'https://api.github.com/users/merjoontest22/followers',
          following_url: 'https://api.github.com/users/merjoontest22/following{/other_user}',
          gists_url: 'https://api.github.com/users/merjoontest22/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/merjoontest22/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/merjoontest22/subscriptions',
          organizations_url: 'https://api.github.com/users/merjoontest22/orgs',
          repos_url: 'https://api.github.com/users/merjoontest22/repos',
          events_url: 'https://api.github.com/users/merjoontest22/events{/privacy}',
          received_events_url: 'https://api.github.com/users/merjoontest22/received_events',
          type: 'User',
          user_view_type: 'public',
          site_admin: false,
        },
      ]);
    });
  });

  describe('getUsers', () => {
    it('getUsers failed with "Missing organization" error', async () => {
      await expect(service.getUsers()).rejects.toThrow('Missing organization');
    });

    it('getUsers', async () => {
      await service.init();
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
  });

  describe('getProjects', () => {
    it('getProjects failed with "Missing organization" error', async () => {
      await expect(service.getProjects()).rejects.toThrow('Missing organization');
    });

    it('getProjects', async () => {
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
        remote_id: expect.any(Number),
        name: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        description: expect.any(String),
        remote_modified_at: expect.any(Number),
        remote_created_at: expect.any(Number),
      });
    });
  });

  describe('getTasks', () => {
    it('getTasks failed with "Missing repository owner and name" error', async () => {
      await expect(service.getTasks()).rejects.toThrow('Missing repository owner and name');
    });

    it('should return a valid task structure', async () => {
      await service.init();
      await service.getProjects();
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
  });

  it('checkReferences', async () => {
    await service.init();
    await service.getProjects();
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
