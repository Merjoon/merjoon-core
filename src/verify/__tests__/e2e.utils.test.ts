import fs from 'node:fs/promises';
import { MerjoonExecutor } from '../utils';
import { EntityDependencyMap, IntegrationId } from '../types';
import { getTodoistService } from '../../todoist/todoist-service';
import { TodoistService } from '../../todoist/service';
import { IMerjoonService } from '../../common/types';

jest.mock('node:fs/promises');

describe('MeroonExecutor', () => {
  describe('getExecutionOrder', () => {
    let executor: MerjoonExecutor;
    const mockService = {} as IMerjoonService;
    beforeEach(() => {
      executor = new MerjoonExecutor(mockService, IntegrationId.Todoist);
    });

    it('should return correct order for simple dependencies', () => {
      const dependencies: EntityDependencyMap = {
        users: [],
        projects: ['users'],
        tasks: ['projects'],
      };
      expect(executor.getExecutionOrder(dependencies)).toEqual([
        ['users'],
        ['projects'],
        ['tasks'],
      ]);
    });

    it('should handle parallel dependencies', () => {
      const dependencies: EntityDependencyMap = {
        users: [],
        projects: [],
        tasks: ['users', 'projects'],
      };
      expect(executor.getExecutionOrder(dependencies)).toEqual([['users', 'projects'], ['tasks']]);
    });

    it('should throw for circular dependencies', () => {
      const dependencies: EntityDependencyMap = {
        users: ['projects'],
        tasks: ['users'],
        projects: ['tasks'],
      };
      expect(() => executor.getExecutionOrder(dependencies)).toThrow(
        'Cycle detected in dependencies',
      );
    });

    it('should throw for circular dependencies 2', () => {
      const dependencies: EntityDependencyMap = {
        users: ['projects'],
        tasks: ['users'],
        projects: ['tasks'],
        comments: [],
        workspace: ['comments'],
      };
      expect(() => executor.getExecutionOrder(dependencies)).toThrow(
        'Cycle detected in dependencies',
      );
    });

    it('should call all methods if dependencies are empty', () => {
      const dependencies: EntityDependencyMap = {
        users: [],
        projects: [],
        tasks: [],
      };
      expect(executor.getExecutionOrder(dependencies)).toEqual([['users', 'projects', 'tasks']]);
    });

    it('should handle this case where the one is dependent on the others', () => {
      const dependencies: EntityDependencyMap = {
        users: [],
        projects: ['users'],
        tasks: ['users'],
      };
      expect(executor.getExecutionOrder(dependencies)).toEqual([['users'], ['projects', 'tasks']]);
    });

    it('should handle this many dependencies', () => {
      const dependencies: EntityDependencyMap = {
        users: [],
        projects: [],
        tasks: [],
        comments: [],
        workspaces: [],
      };
      expect(executor.getExecutionOrder(dependencies)).toEqual([
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
      expect(executor.getExecutionOrder(dependencies)).toEqual([
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
      expect(executor.getExecutionOrder(dependencies)).toEqual([
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
      expect(() => executor.getExecutionOrder(dependencies)).toThrow(
        'Cycle detected in dependencies',
      );
    });

    it('should handle deep dependency chains', () => {
      const dependencies: EntityDependencyMap = {
        a: ['b'],
        b: ['c'],
        c: ['d'],
        d: ['e'],
        e: [],
      };
      expect(executor.getExecutionOrder(dependencies)).toEqual([['e'], ['d'], ['c'], ['b'], ['a']]);
    });

    it('should throw for self-dependencies', () => {
      const dependencies: EntityDependencyMap = {
        a: ['a'],
        b: [],
      };
      expect(() => executor.getExecutionOrder(dependencies)).toThrow(
        'Cycle detected in dependencies',
      );
    });

    it('should detect cycles in partial graphs', () => {
      const dependencies: EntityDependencyMap = {
        a: ['b'],
        b: ['c'],
        c: ['a'],
        d: [],
        e: ['d'],
      };
      expect(() => executor.getExecutionOrder(dependencies)).toThrow(
        'Cycle detected in dependencies',
      );
    });
  });

  describe('fetchEntitiesInOrder', () => {
    let service: TodoistService;
    let executor: MerjoonExecutor;
    beforeEach(async () => {
      jest.clearAllMocks();
      service = getTodoistService();
      await service.init();

      service.getUsers = jest.fn().mockResolvedValue([]);
      service.getProjects = jest.fn().mockResolvedValue([]);
      service.getTasks = jest.fn().mockResolvedValue([]);
    });

    beforeEach(() => {
      executor = new MerjoonExecutor(service, IntegrationId.Todoist);
    });

    it('should call methods in correct dependency order', async () => {
      const dependencies: EntityDependencyMap = {
        projects: [],
        users: ['projects'],
        tasks: [],
      };

      await executor.fetchEntitiesInOrder(dependencies);

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
    let executor: MerjoonExecutor;
    const mockService = {} as IMerjoonService;
    beforeEach(() => {
      executor = new MerjoonExecutor(mockService, IntegrationId.Todoist);
    });

    it('should initialize graph and inLevel structures', () => {
      const dependencies: EntityDependencyMap = {
        users: [],
        projects: ['users'],
        tasks: ['projects'],
      };

      const { graph, inLevel } = executor.initGraph(dependencies);

      expect(graph).toEqual({
        users: [],
        projects: [],
        tasks: [],
      });

      expect(inLevel).toEqual({
        users: 0,
        projects: 0,
        tasks: 0,
      });
    });

    it('should handle empty dependencies', () => {
      const dependencies: EntityDependencyMap = {};
      const { graph, inLevel } = executor.initGraph(dependencies);

      expect(graph).toEqual({});
      expect(inLevel).toEqual({});
    });
  });

  describe('buildGraph', () => {
    let executor: MerjoonExecutor;
    const mockService = {} as IMerjoonService;
    beforeEach(() => {
      executor = new MerjoonExecutor(mockService, IntegrationId.Todoist);
    });

    it('should build correct dependency graph', () => {
      const dependencies: EntityDependencyMap = {
        users: [],
        projects: ['users'],
        tasks: ['projects'],
      };
      const { graph, inLevel } = executor.initGraph(dependencies);

      executor.buildGraph(dependencies, graph, inLevel);

      expect(graph).toEqual({
        users: ['projects'],
        projects: ['tasks'],
        tasks: [],
      });

      expect(inLevel).toEqual({
        users: 0,
        projects: 1,
        tasks: 1,
      });
    });

    it('should handle multiple dependencies', () => {
      const dependencies: EntityDependencyMap = {
        tasks: ['users', 'projects'],
        users: [],
        projects: [],
      };
      const { graph, inLevel } = executor.initGraph(dependencies);

      executor.buildGraph(dependencies, graph, inLevel);

      expect(graph).toEqual({
        users: ['tasks'],
        projects: ['tasks'],
        tasks: [],
      });

      expect(inLevel).toEqual({
        users: 0,
        projects: 0,
        tasks: 2,
      });
    });
  });

  describe('topologicalSort', () => {
    let executor: MerjoonExecutor;
    const mockService = {} as IMerjoonService;
    beforeEach(() => {
      executor = new MerjoonExecutor(mockService, IntegrationId.Todoist);
    });

    it('should return correct topological order', () => {
      const dependencies: EntityDependencyMap = {
        users: [],
        projects: ['users'],
        tasks: ['projects'],
      };
      const { graph, inLevel } = executor.initGraph(dependencies);
      executor.buildGraph(dependencies, graph, inLevel);

      const result = executor.topologicalSort(dependencies, graph, inLevel);
      expect(result).toEqual([['users'], ['projects'], ['tasks']]);
    });

    it('should throw for circular dependencies', () => {
      const dependencies: EntityDependencyMap = {
        users: ['tasks'],
        tasks: ['users'],
      };
      const { graph, inLevel } = executor.initGraph(dependencies);
      executor.buildGraph(dependencies, graph, inLevel);

      expect(() => executor.topologicalSort(dependencies, graph, inLevel)).toThrow(
        'Cycle detected in dependencies',
      );
    });
  });
});
