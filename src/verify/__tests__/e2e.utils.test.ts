import fs from 'node:fs/promises';
import { fetchEntitiesInOrder, getExecutionOrder } from '../utils';
import { DependenciesMap, IntegrationId } from '../types';
import { IMerjoonService } from '../../common/types';
import { getTodoistService } from '../../todoist/todoist-service';
import { TodoistService } from '../../todoist/service';

jest.mock('node:fs/promises');

describe('getExecutionOrder', () => {
  it('should return correct order for simple dependencies', () => {
    const dependencies: DependenciesMap = {
      users: [],
      projects: ['users'],
      tasks: ['projects'],
    };

    expect(getExecutionOrder(dependencies)).resolves.toEqual([['users'], ['projects'], ['tasks']]);
  });

  it('should handle parallel dependencies', () => {
    const dependencies: DependenciesMap = {
      users: [],
      projects: [],
      tasks: ['users', 'projects'],
    };

    expect(getExecutionOrder(dependencies)).resolves.toEqual([['users', 'projects'], ['tasks']]);
  });

  it('should throw for circular dependencies', () => {
    const dependencies: DependenciesMap = {
      users: ['projects'],
      tasks: ['users'],
      projects: ['tasks'],
    };

    expect(getExecutionOrder(dependencies)).rejects.toThrow('Circular dependency detected');
  });

  it('should call all methods if dependencies are empty', () => {
    const dependencies: DependenciesMap = {
      users: [],
      projects: [],
      tasks: [],
    };

    expect(getExecutionOrder(dependencies)).resolves.toEqual([['users', 'projects', 'tasks']]);
  });
});
describe('fetchEntitiesInOrder', () => {
  let service: TodoistService;
  beforeEach(async () => {
    jest.clearAllMocks();
    service = getTodoistService();
    await service.init();

    // Mock the service methods
    service.getUsers = jest.fn().mockResolvedValue([]);
    service.getProjects = jest.fn().mockResolvedValue([]);
    service.getTasks = jest.fn().mockResolvedValue([]);
  });

  it('should call methods in correct dependency order', async () => {
    const dependencies: DependenciesMap = {
      projects: [],
      users: ['projects'],
      tasks: [],
    };

    (service as IMerjoonService).integrationId = IntegrationId.Todoist;

    await fetchEntitiesInOrder(service, dependencies);

    const projectsCallOrder = (service.getProjects as jest.Mock).mock.invocationCallOrder[0];
    const usersCallOrder = (service.getUsers as jest.Mock).mock.invocationCallOrder[0];

    expect(projectsCallOrder).toBeLessThan(usersCallOrder);

    expect(service.getTasks).toHaveBeenCalled();

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
