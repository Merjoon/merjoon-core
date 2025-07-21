import fs from 'node:fs/promises';
import { fetchEntitiesInOrder, getExecutionOrder, saveEntities } from '../utils';
import { DependenciesMap, IntegrationId } from '../types';
import { IMerjoonService } from '../../common/types';
import { getTodoistService } from '../../todoist/todoist-service';
import { TodoistService } from '../../todoist/service';

jest.mock('node:fs/promises');

describe('saveEntities', () => {
  it('should save entities to correct file', async () => {
    const testData = [
      {
        id: '9b5c317c8755ef27545ad1acca927672',
        remote_id: '52377329',
        name: 'merjoontest1',
        email_address: 'merjoontest1@gmail.com',
        created_at: 1752921716431,
        modified_at: 1752921716431,
      },
    ];
    await saveEntities(IntegrationId.Todoist, 'users', testData);

    expect(fs.mkdir).toHaveBeenCalledWith('.transformed/todoist', {
      recursive: true,
    });
    expect(fs.writeFile).toHaveBeenCalledWith(
      `.transformed/${IntegrationId.Todoist}/users.json`,
      JSON.stringify(testData, null, 2),
    );
  });
});

describe('getExecutionOrder', () => {
  it('should return correct order for simple dependencies', () => {
    const dependencies: DependenciesMap = {
      users: [],
      projects: ['users'],
      tasks: ['projects'],
    };

    expect(getExecutionOrder(dependencies)).resolves.toEqual(['users', 'projects', 'tasks']);
  });

  it('should handle parallel dependencies', () => {
    const dependencies: DependenciesMap = {
      users: [],
      projects: [],
      tasks: ['users', 'projects'],
    };

    const result = getExecutionOrder(dependencies);
    expect(result).resolves.toContain('users');
    expect(result).resolves.toContain('projects');
    expect(result).resolves.toContain('tasks');
  });

  it('should throw for circular dependencies', () => {
    const dependencies: DependenciesMap = {
      users: ['projects'],
      tasks: ['users'],
      projects: ['tasks'],
    };

    expect(getExecutionOrder(dependencies)).rejects.toThrow('Circular dependency detected');
  });
});

describe('fetchEntitiesInOrder', () => {
  let service: TodoistService;
  beforeEach(async () => {
    jest.clearAllMocks();
    service = getTodoistService();
    await service.init();
  });

  it('should call methods in correct dependency order', async () => {
    const dependencies: DependenciesMap = {
      projects: [],
      users: ['projects'],
      tasks: [],
    };

    (service as IMerjoonService).integrationId = IntegrationId.Todoist;

    await fetchEntitiesInOrder(service, dependencies);

    const mockCallOrder = ['projects', 'users', 'tasks'];

    expect(mockCallOrder).toEqual(['projects', 'users', 'tasks']);

    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('.transformed/todoist/projects.json'),
      expect.any(String),
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('.transformed/todoist/users.json'),
      expect.any(String),
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('.transformed/todoist/tasks.json'),
      expect.any(String),
    );
  });
});
