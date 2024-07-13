import {
  IMerjoonCollections,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../../common/types';
import { HeightApi } from '../api';
import { HeightService } from '../service';
import { HeightTransformer } from '../transformer';
import { IHeightConfig } from '../types';

describe('e2e Height', () => {
  let service: HeightService;

  beforeEach(() => {
    const { HEIGHT_SECRET } = process.env;

    const config: IHeightConfig = {
      secret: HEIGHT_SECRET!,
    };

    const api: HeightApi = new HeightApi(config);
    const transformer: HeightTransformer = new HeightTransformer();
    service = new HeightService(api, transformer);
  });

  it('getUsers', async () => {
    const users: IMerjoonUsers = await service.getUsers();

    expect(Object.keys(users[0])).toEqual(
      expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'email_address',
        'remote_created_at',
        'remote_modified_at',
      ])
    );

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

    expect(Object.keys(collections[0])).toEqual(
      expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'description',
        'remote_created_at',
        'remote_modified_at',
      ])
    );

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

    expect(Object.keys(tasks[0])).toEqual(
      expect.arrayContaining([
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
      ])
    );

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
});
