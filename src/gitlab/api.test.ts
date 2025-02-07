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
  it('parses a gitlab tasks test', async () => {
    const gitLab = new GitLab(config);
    const tasks = await gitLab.sendGetRequest('issues');
    expect(tasks[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title:expect.any(String),
      assignees:expect.any(Array),
      labels:expect.any(Array),
      description:expect.any(String),
      project_id:expect.any(Number),
      created_at:expect.any(String),
      updated_at:expect.any(String),
      web_url:expect.any(String),
    }));
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