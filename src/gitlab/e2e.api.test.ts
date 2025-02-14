import {GitLab} from './api';
import {IGitLabConfig} from './types';
const token = process.env.GITLAB_TOKEN ?? '';
const config: IGitLabConfig = {
  token: token,
};
describe('Groups',  () => {

  it('parses a gitlab Groups test', async () => {
    const gitLab = new GitLab(config);
    const groups = await gitLab.getAllGroups();
    expect(groups[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
    }));
  });
});
describe('Members', () => {
  it('parses a gitlab Groups test', async () => {
    const gitlab = new GitLab(config);
    const groups = await  gitlab.getAllGroups();
    const members = await gitlab.getMembersByGroupId(groups[0].id);
    const membersByGroupId = members.flat();
    expect(membersByGroupId[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
      username: expect.any(String),
    }));
  });
});
describe('Issues', () => {
  it('parses a gitlab issues test', async () => {
    const gitLab = new GitLab(config);
    const issues = await gitLab.getAllIssues();

    expect(issues[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      assignee: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
      }),
      description: expect.any(String),
      created_at: expect.any(String),
      state: expect.any(String),
      web_url: expect.any(String),
      labels: expect.arrayContaining([expect.any(String)]),
    }));
  });
});

describe('projects', () => {
  it('parses a gitlab projects test', async () => {
    const gitLab = new GitLab(config); // Use the test subclass
    const projects = await gitLab.getAllProjects();

    // Test the project structure
    expect(projects[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      last_activity_at: expect.any(String),
      created_at: expect.any(String),
    }));
  });
});
