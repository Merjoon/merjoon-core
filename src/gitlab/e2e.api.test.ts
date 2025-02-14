import {GitLab} from './api';
import {IGitLabConfig} from './types';
const token = process.env.GITLAB_TOKEN ?? '';
const config: IGitLabConfig = {
  token: token,
};
describe('Groups',  () => {
  class GitLabTest extends GitLab {
    public async IGitlabGroup(){
      return super.IGitlabGroup();
    }
  }
  it('parses a gitlab Groups test', async () => {
    const gitLab = new GitLabTest(config);
    const groups = await gitLab.IGitlabGroup();
    expect(groups[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
    }));
  });
});
describe('Members', () => {
  class GitLabTest extends GitLab {
    public async  getMembersByGroupId(){
      return super.getMembersByGroupId();
    }
  }
  it('parses a gitlab Groups test', async () => {
    const gitlab = new GitLabTest(config);
    const members = await gitlab.getMembersByGroupId();
    const membersByGroupId = members.flat();
    expect(membersByGroupId[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
      username: expect.any(String),
    }));
  });
});
describe('Issues', () => {
  class GitLabTest extends GitLab {
    public async getAllIssues() {
      return super.getAllIssues();
    }
  }

  it('parses a gitlab issues test', async () => {
    const gitLab = new GitLabTest(config);
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
  class GitLabTest extends GitLab {
    public async getAllProjects() {
      return super.getAllProjects();
    }
  }

  it('parses a gitlab projects test', async () => {
    const gitLab = new GitLabTest(config); // Use the test subclass
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
