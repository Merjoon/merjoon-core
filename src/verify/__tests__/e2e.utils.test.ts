import fs from 'node:fs/promises';
import {
  createGraph,
  fetchEntitiesInSequence,
  getExecutionSequence,
  sortTopologically,
} from '../utils';
import { EntityDependencyMap, IntegrationId } from '../types';
import { getTodoistService } from '../../todoist/todoist-service';
import { TodoistService } from '../../todoist/service';

jest.mock('node:fs/promises');

describe('getExecutionSequence', () => {
  it('should return correct order for simple dependencies', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: ['users'],
      tasks: ['projects'],
    };
    expect(getExecutionSequence(dependencies)).toEqual([['users'], ['projects'], ['tasks']]);
  });

  it('should handle parallel dependencies', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: [],
      tasks: ['users', 'projects'],
    };
    expect(getExecutionSequence(dependencies)).toEqual([['users', 'projects'], ['tasks']]);
  });

  it('should throw for circular dependencies', () => {
    const dependencies: EntityDependencyMap = {
      users: ['projects'],
      tasks: ['users'],
      projects: ['tasks'],
    };
    expect(() => getExecutionSequence(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should throw for circular dependencies 2', () => {
    const dependencies: EntityDependencyMap = {
      users: ['projects'],
      tasks: ['users'],
      projects: ['tasks'],
      comments: [],
      workspace: ['comments'],
    };
    expect(() => getExecutionSequence(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should call all methods if dependencies are empty', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: [],
      tasks: [],
    };
    expect(getExecutionSequence(dependencies)).toEqual([['users', 'projects', 'tasks']]);
  });

  it('should handle this case where the one is dependent on the others', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: ['users'],
      tasks: ['users'],
    };
    expect(getExecutionSequence(dependencies)).toEqual([['users'], ['projects', 'tasks']]);
  });

  it('should handle this many dependencies', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: [],
      tasks: [],
      comments: [],
      workspaces: [],
    };
    expect(getExecutionSequence(dependencies)).toEqual([
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
    expect(getExecutionSequence(dependencies)).toEqual([
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
    expect(getExecutionSequence(dependencies)).toEqual([
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
    expect(() => getExecutionSequence(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should handle deep dependency chains', () => {
    const dependencies: EntityDependencyMap = {
      a: ['b'],
      b: ['c'],
      c: ['d'],
      d: ['e'],
      e: [],
    };
    expect(getExecutionSequence(dependencies)).toEqual([['e'], ['d'], ['c'], ['b'], ['a']]);
  });

  it('should throw for self-dependencies', () => {
    const dependencies: EntityDependencyMap = {
      a: ['a'],
      b: [],
    };
    expect(() => getExecutionSequence(dependencies)).toThrow('Cycle detected in dependencies');
  });

  it('should detect cycles in partial graphs', () => {
    const dependencies: EntityDependencyMap = {
      a: ['b'],
      b: ['c'],
      c: ['a'],
      d: [],
      e: ['d'],
    };
    expect(() => getExecutionSequence(dependencies)).toThrow('Cycle detected in dependencies');
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

    await fetchEntitiesInSequence(service, IntegrationId.Todoist, dependencies);

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

describe('sortTopologically', () => {
  it('should return correct stages for simple graph', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      tasks: ['users'],
    };
    const { graph, indegree } = createGraph(dependencies);

    const stages = sortTopologically(dependencies, graph, indegree);
    expect(stages).toEqual([['users'], ['tasks']]);
  });

  it('should throw on cyclic graph', () => {
    const dependencies: EntityDependencyMap = {
      users: ['tasks'],
      tasks: ['users'],
    };
    const { graph, indegree } = createGraph(dependencies);

    expect(() => sortTopologically(dependencies, graph, indegree)).toThrow(
      'Cycle detected in dependencies',
    );
  });
});

describe('createGraph', () => {
  it('should build graph and indegree correctly for simple dependencies', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: ['users'],
      tasks: ['projects'],
    };

    const { graph, indegree } = createGraph(dependencies);

    expect(graph).toEqual({
      users: ['projects'],
      projects: ['tasks'],
      tasks: [],
    });

    expect(indegree).toEqual({
      users: 0,
      projects: 1,
      tasks: 1,
    });
  });

  it('should handle multiple dependencies', () => {
    const dependencies: EntityDependencyMap = {
      users: [],
      projects: ['users'],
      tasks: ['users', 'projects'],
    };

    const { graph, indegree } = createGraph(dependencies);

    expect(graph).toEqual({
      users: ['projects', 'tasks'],
      projects: ['tasks'],
      tasks: [],
    });

    expect(indegree).toEqual({
      users: 0,
      projects: 1,
      tasks: 2,
    });
  });

  it('should handle nodes with no dependencies', () => {
    const dependencies: EntityDependencyMap = {
      a: [],
      b: [],
      c: [],
    };

    const { graph, indegree } = createGraph(dependencies);

    expect(graph).toEqual({
      a: [],
      b: [],
      c: [],
    });

    expect(indegree).toEqual({
      a: 0,
      b: 0,
      c: 0,
    });
  });
});
