import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from "../../common/types";
import { ID_REGEX } from "../../utils/regex";
import { getJiraService } from "../jira-service";
import { JiraService } from "../service";

describe("Jira ", () => {
    let service: JiraService;

  beforeEach(() => {
    service = getJiraService();
  });

  it("getProjects", async () => {
    const projects: IMerjoonProjects = await service.getProjects();

    expect(Object.keys(projects[0])).toEqual(
      expect.arrayContaining([
        "id",
        "remote_id",
        "name",
        "created_at",
        "modified_at",
        "remote_created_at",
        "remote_modified_at",
      ])
    );

    expect(projects[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        name: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        remote_created_at: expect.any(String),
        remote_modified_at: expect.any(String),
      });
  });

  it("getUsers", async () => {
    const users: IMerjoonUsers = await service.getUsers();

    expect(Object.keys(users[0])).toEqual(
      expect.arrayContaining([
        "id",
        "remote_id",
        "name",
        "created_at",
        "modified_at",
        "email_address"
      ])
    );

    expect(users[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        remote_id: expect.any(String),
        name: expect.any(String),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        email_address: expect.any(String)
      });
  });

  it("getTasks", async () => {
    const tasks: IMerjoonTasks = await service.getTasks();

    expect(Object.keys(tasks[0])).toEqual(
      expect.arrayContaining([
        "id",
        "created_at",
        "modified_at",
        "remote_id",
        "name",
        "assignees",
        "status",
        "description",
        "projects",
        "remote_created_at",
        "remote_modified_at",
        "ticket_url"
      ])
    );

    expect(tasks[0]).toEqual({
        id: expect.stringMatching(ID_REGEX),
        created_at: expect.any(Number),
        modified_at: expect.any(Number),
        remote_id: expect.any(String),
        name: expect.any(String),
        assignees: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        status: expect.any(String),
        desription: expect.any(String),
        projects: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
        remote_created_at: expect.any(String),
        remote_modified_at: expect.any(String),
        ticket_url: expect.any(String)
      });
  });
})