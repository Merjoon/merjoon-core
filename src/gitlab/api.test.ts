import {GitLab} from './api';
import {IGitLabConfig} from './types';
const token = process.env.GITLAB_TOKEN ?? '';
const config: IGitLabConfig = {
  token: token,
};
describe('gitlabApi users test', () => {
  it('parses a gitlab users test', async () => {
    const gitLab = new GitLab(config);
    const groups = await gitLab.sendGetRequest('groups');
    const users = await gitLab.sendGetRequest(`groups/${groups[0].id}/members`);
    expect(users[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      username: expect.any(String),
      created_at: expect.any(String),
    }));
  });
});
describe('gitlabApi tasks test', () => {
  const gitLab = new GitLab(config);
  const testCases = [
    { description: 'Bug found', expected: 'Bug found' },
    { description: null, expected: null },
    { description: '', expected:'' },
  ];

  test.each(testCases)('should handle description correctly', async ({ description, expected }) => {
    jest.spyOn(gitLab, 'sendGetRequest').mockResolvedValue([
      {
        id: 123,
        title: 'Fix login issue',
        assignees: [],
        labels: ['bug'],
        description: description,
        project_id: 456,
        created_at: '2024-02-10T12:00:00Z',
        updated_at: '2024-02-11T12:00:00Z',
        web_url: 'https://gitlab.com/issues/123',
      }
    ]);

    const tasks = await gitLab.sendGetRequest('issues');
    expect(tasks[0].description).toBe(expected);
  });
});

describe('gitlabApi projects', () => {
  it('parses a gitlab projects test', async () => {
    const gitLab = new GitLab(config);
    const projects = await gitLab.sendGetRequest('projects' , {owned: true});
    expect(projects[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      last_activity_at:expect.any(String),
      created_at:expect.any(String),
    }));
  });
});