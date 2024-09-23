import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from "../../common/types";
import { TeamworkTransformer } from '../transformer';
import { TeamworkService } from '../service';
import { ITeamworkConfig } from '../types';
import { TeamworkApi } from '../api';
import { ID_REGEX } from "../../utils/regex";

describe('e2e TeamWork', () => {
  let service: TeamworkService;

  beforeEach(() => {
    const {
      TEAMWORK_TOKEN,
      TEAMWORK_PASSWORD,
      TEAMWORK_SUBDOMAIN,
    } = process.env;

    const config: ITeamworkConfig = {
      token: TEAMWORK_TOKEN!,
      password: TEAMWORK_PASSWORD!,
      subdomain: TEAMWORK_SUBDOMAIN!,
    };

    const api: TeamworkApi = new TeamworkApi(config);
    const transformer: TeamworkTransformer = new TeamworkTransformer();
    service = new TeamworkService(api, transformer);
  });

  it('getUsers', async () => {
    const users: IMerjoonUsers = await service.getUsers();

    expect(Object.keys(users[0])).toEqual(expect.arrayContaining([
      'id',
      'remote_id',
      'name',
      'email_address',
      'remote_created_at',
      'remote_modified_at',
      'created_at',
      'modified_at',
    ]));

    expect(users[0]).toEqual({
      id: expect.stringMatching(ID_REGEX),
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
    const projects: IMerjoonProjects = await service.getProjects();

    expect(Object.keys(projects[0])).toEqual(expect.arrayContaining([
      'id',
      'remote_id',
      'name',
      'description',
      'remote_created_at',
      'remote_modified_at',
      'created_at',
      'modified_at',
    ]));

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
    const tasks: IMerjoonTasks = await service.getTasks();

    expect(Object.keys(tasks[0])).toEqual(expect.arrayContaining([
      'id',
      'remote_id',
      'name',
      'assignees',
      'status',
      'description',
      'projects',
      'remote_created_at',
      'remote_updated_at',
      'created_at',
      'modified_at',
    ]));

    expect(tasks[0]).toEqual({
      id: expect.stringMatching(ID_REGEX),
      remote_id: expect.any(String),
      name: expect.any(String),
      assignees: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
      status: expect.any(String),
      description: expect.any(String),
      projects: expect.arrayContaining([expect.stringMatching(ID_REGEX)]),
      remote_created_at: expect.any(String),
      remote_updated_at: expect.any(String),
      created_at: expect.any(Number),
      modified_at: expect.any(Number),
    });
  });
})
