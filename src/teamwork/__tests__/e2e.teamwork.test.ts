import { IMerjoonCollections, IMerjoonTasks, IMerjoonUsers } from "../../common/types";
import { ITeamworkConfig, TeamworkApiPath } from '../types';
import { TeamworkTransformer } from '../transformer';
import { TeamworkService } from '../service';
import { TeamworkApi } from '../api';

describe('e2e TeamWork', () => {
  let service: TeamworkService;
  let api: TeamworkApi;

  beforeEach(() => {
    const config: ITeamworkConfig = {
      token: process.env.TEAMWORK_TOKEN!,
      password: process.env.TEAMWORK_PASSWORD!,
      subdomain: process.env.TEAMWORK_SUBDOMAIN!,
    };

    api = new TeamworkApi(config);
    const transformer: TeamworkTransformer = new TeamworkTransformer();
    service = new TeamworkService(api, transformer);
  });

  it('sendRequest', async () => {
    const users = await api.sendGetRequest(TeamworkApiPath.People, {
      page: 1,
      pageSize: 1,
    });

    expect(Object.keys(users[0])).toEqual(expect.arrayContaining([
      'id',
      'full-name',
      'email-address',
      'created-at',
      'last-changed-on',
    ]));

    expect(users.length).toBe(1);
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
    ]));

    expect(users[0]).toEqual({
      id: expect.any(String),
      remote_id: expect.any(String),
      name: expect.any(String),
      email_address: expect.any(String),
      remote_created_at: expect.any(String),
      remote_modified_at: expect.any(String),
    });
  });

  it('getCollections', async () => {
    const collections: IMerjoonCollections = await service.getCollections();

    expect(Object.keys(collections[0])).toEqual(expect.arrayContaining([
      'id',
      'remote_id',
      'name',
      'description',
      'remote_created_at',
      'remote_modified_at',
    ]));

    expect(collections[0]).toEqual({
      id: expect.any(String),
      remote_id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      remote_created_at: expect.any(String),
      remote_modified_at: expect.any(String),
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
      'collections',
      'remote_created_at',
      'remote_updated_at',
      'priority',
    ]));

    expect(tasks[0]).toEqual({
      id: expect.any(String),
      remote_id: expect.any(String),
      name: expect.any(String),
      status: expect.any(String),
      description: expect.any(String),
      remote_created_at: expect.any(String),
      remote_updated_at: expect.any(String),
      priority: expect.any(String),
      assignees: expect.arrayContaining([expect.any(String)]),
      collections: expect.arrayContaining([expect.any(String)]),
    });
  });
})
