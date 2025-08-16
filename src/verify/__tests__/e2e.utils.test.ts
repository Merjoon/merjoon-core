import fs from 'node:fs/promises';
import {
  buildGraph,
  fetchEntitiesInOrder,
  getExecutionOrder,
  initGraph,
  topologicalSort,
} from '../utils';
import { EntityDependencyMap, IntegrationId } from '../types';
import { getTodoistService } from '../../todoist/todoist-service';
import { TodoistService } from '../../todoist/service';

jest.mock('node:fs/promises');

describe('getExecutionOrder', () => {
  it('should return correct order for simple dependencies', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: ['users'],
      tasks: ['projects'],
    };
    expect(getExecutionOrder(dependencies)).toEqual([['users'], ['projects'], ['tasks']]);
  });

  it('should handle parallel dependencies', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: [],
      tasks: ['users', 'projects'],
    };
    expect(getExecutionOrder(dependencies)).toEqual([['users', 'projects'], ['tasks']]);
  });

  it('should throw for circular dependencies', () => {
    const dependencies: EntityDependencyMap = {
      users: ['projects'],
      tasks: ['users'],
      projects: ['tasks'],
    };
    expect(() => getExecutionOrder(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should throw for circular dependencies 2', () => {
    const dependencies: EntityDependencyMap = {
      users: ['projects'],
      tasks: ['users'],
      projects: ['tasks'],
      comments: [],
      workspace: ['comments'],
    };
    expect(() => getExecutionOrder(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should call all methods if dependencies are empty', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: [],
      tasks: [],
    };
    expect(getExecutionOrder(dependencies)).toEqual([['users', 'projects', 'tasks']]);
  });

  it('should handle this case where the one is dependent on the others', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: ['users'],
      tasks: ['users'],
    };
    expect(getExecutionOrder(dependencies)).toEqual([['users'], ['projects', 'tasks']]);
  });

  it('should handle this many dependencies', () => {
    const dependencies: EntityDependencyMap = {
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
    const dependencies: EntityDependencyMap = {
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
    const dependencies: EntityDependencyMap = {
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
    const dependencies: EntityDependencyMap = {
      users: ['projects'],
      tasks: ['users'],
      projects: ['tasks'],
      comments: ['workspaces'],
      workspaces: ['users'],
    };
    expect(() => getExecutionOrder(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should handle deep dependency chains', () => {
    const dependencies: EntityDependencyMap = {
      a: ['b'],
      b: ['c'],
      c: ['d'],
      d: ['e'],
      e: [],
    };
    expect(getExecutionOrder(dependencies)).toEqual([['e'], ['d'], ['c'], ['b'], ['a']]);
  });

  it('should throw for self-dependencies', () => {
    const dependencies: EntityDependencyMap = {
      a: ['a'],
      b: [],
    };
    expect(() => getExecutionOrder(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should detect cycles in partial graphs', () => {
    const dependencies: EntityDependencyMap = {
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
    const dependencies: EntityDependencyMap = {
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

describe('initGraph', () => {
  it('should initialize graph and inLevel correctly', () => {
    const dependencies: EntityDependencyMap = {
      users: ['tasks'],
      tasks: [],
    };

    const { graph, inLevel } = initGraph(dependencies);

    expect(graph).toEqual({
      users: [],
      tasks: [],
    });

    expect(inLevel).toEqual({
      users: 0,
      tasks: 0,
    });
  });
});

describe('buildGraph', () => {
  it('should populate graph and inLevel correctly', () => {
    const dependencies: EntityDependencyMap = {
      users: ['tasks'],
      tasks: [],
    };

    const { graph, inLevel } = initGraph(dependencies);
    buildGraph(dependencies, graph, inLevel);

    expect(graph).toEqual({
      users: [],
      tasks: ['users'],
    });

    expect(inLevel).toEqual({
      users: 1,
      tasks: 0,
    });
  });
});

describe('topologicalSort', () => {
  it('should return correct stages for simple graph', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      tasks: ['users'],
    };
    const { graph, inLevel } = initGraph(dependencies);
    buildGraph(dependencies, graph, inLevel);

    const stages = topologicalSort(dependencies, graph, inLevel);
    expect(stages).toEqual([['users'], ['tasks']]);
  });

  it('should throw on cyclic graph', () => {
    const dependencies: EntityDependencyMap = {
      users: ['tasks'],
      tasks: ['users'],
    };
    const { graph, inLevel } = initGraph(dependencies);
    buildGraph(dependencies, graph, inLevel);

    expect(() => topologicalSort(dependencies, graph, inLevel)).toThrow(
      'Cycle detected in dependencies',
    );
  });
});
