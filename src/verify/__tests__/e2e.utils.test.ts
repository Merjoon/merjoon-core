import fs from 'node:fs/promises';
import { fetchEntitiesInOrder, getExecutionOrder } from '../utils';
import { DependenciesMap, IntegrationId } from '../types';
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

    expect(getExecutionOrder(dependencies)).toEqual([['users'], ['projects'], ['tasks']]);
  });

  it('should handle parallel dependencies', () => {
    const dependencies: DependenciesMap = {
      users: [],
      projects: [],
      tasks: ['users', 'projects'],
    };

    expect(getExecutionOrder(dependencies)).toEqual([['users', 'projects'], ['tasks']]);
  });

  it('should throw for circular dependencies', () => {
    const dependencies: DependenciesMap = {
      users: ['projects'],
      tasks: ['users'],
      projects: ['tasks'],
    };

    expect(() => getExecutionOrder(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should throw for circular dependencies 2', () => {
    const dependencies: DependenciesMap = {
      users: ['projects'],
      tasks: ['users'],
      projects: ['tasks'],
      comments: [],
      workspace: ['comments'],
    };

    expect(() => getExecutionOrder(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should call all methods if dependencies are empty', () => {
    const dependencies: DependenciesMap = {
      users: [],
      projects: [],
      tasks: [],
    };

    expect(getExecutionOrder(dependencies)).toEqual([['users', 'projects', 'tasks']]);
  });

  it('should handle this case where the one is dependent on the others', () => {
    const dependencies: DependenciesMap = {
      users: [],
      projects: ['users'],
      tasks: ['users'],
    };
    expect(getExecutionOrder(dependencies)).toEqual([['users'], ['projects', 'tasks']]);
  });
  it('should handle this many dependencies', () => {
    const dependencies: DependenciesMap = {
      users: [],
      projects: [],
      tasks: [],
      comments: [],
      workspaces: [],
    };
    expect(getExecutionOrder(dependencies)).toEqual([
      ['users', 'projects', 'tasks', 'comments', 'workspaces'],
    ]);
  });

  it('should handle this 2 separate dependencies', () => {
    const dependencies: DependenciesMap = {
      users: ['tasks'],
      projects: ['tasks'],
      tasks: [],
      comments: [],
      workspaces: ['comments'],
    };
    expect(getExecutionOrder(dependencies)).toEqual([
      ['tasks', 'comments'],
      ['users', 'projects', 'workspaces'],
    ]);
  });
  it('should handle this mixed dependencies', () => {
    const dependencies: DependenciesMap = {
      users: ['tasks'],
      projects: ['tasks'],
      tasks: [],
      comments: ['workspaces'],
      workspaces: ['users'],
    };
    expect(getExecutionOrder(dependencies)).toEqual([
      ['tasks'],
      ['users', 'projects'],
      ['workspaces'],
      ['comments'],
    ]);
  });
  it('should throw for circular dependencies 2', () => {
    const dependencies: DependenciesMap = {
      users: ['projects'],
      tasks: ['users'],
      projects: ['tasks'],
      comments: ['workspaces'],
      workspaces: ['users'],
    };

    expect(() => getExecutionOrder(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should handle deep dependency chains', () => {
    const dependencies: DependenciesMap = {
      a: ['b'],
      b: ['c'],
      c: ['d'],
      d: ['e'],
      e: [],
    };
    expect(getExecutionOrder(dependencies)).toEqual([['e'], ['d'], ['c'], ['b'], ['a']]);
  });
  it('should throw for self-dependencies', () => {
    const dependencies: DependenciesMap = {
      a: ['a'],
      b: [],
    };
    expect(() => getExecutionOrder(dependencies)).toThrow('Cycle detected in dependencies');
  });
  it('should detect cycles in partial graphs', () => {
    const dependencies: DependenciesMap = {
      a: ['b'],
      b: ['c'],
      c: ['a'],
      d: [],
      e: ['d'],
    };
    expect(() => getExecutionOrder(dependencies)).toThrow('Cycle detected in dependencies');
  });
});
describe('fetchEntitiesInOrder', () => {
  let service: TodoistService;
  beforeEach(async () => {
    jest.clearAllMocks();
    service = getTodoistService();
    await service.init();

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

    await fetchEntitiesInOrder(service, IntegrationId.Todoist, dependencies);

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
