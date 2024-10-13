import {
  IMerjoonProjects,
  IMerjoonTasks,
  IMerjoonUsers,
} from "../../common/types";
import { ID_REGEX } from "../../utils/regex";
import { getHeightService } from "../height-service";
import { HeightService } from "../service";

describe("e2e Height", () => {
  let service: HeightService;

  beforeEach(() => {
    service = getHeightService();
  });

  it("getUsers", async () => {
    const users: IMerjoonUsers = await service.getUsers();

    expect(Object.keys(users[0])).toEqual(
      expect.arrayContaining([
        "id",
        "remote_id",
        "name",
        "email_address",
        "remote_created_at",
        "remote_modified_at",
        "created_at",
        "modified_at",
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

  it("getProjects", async () => {
    const projects: IMerjoonProjects = await service.getProjects();

    expect(Object.keys(projects[0])).toEqual(
      expect.arrayContaining([
        "id",
        "remote_id",
        "name",
        "description",
        "remote_created_at",
        "remote_modified_at",
        "created_at",
        "modified_at",
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

  it("getTasks", async () => {
    const tasks: IMerjoonTasks = await service.getTasks();

    expect(Object.keys(tasks[0])).toEqual(
      expect.arrayContaining([
        "id",
        "remote_id",
        "name",
        "status",
        "description",
        "remote_created_at",
        "remote_modified_at",
        "assignees",
        "projects",
        "ticket_url",
        "created_at",
        "modified_at",
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
});
