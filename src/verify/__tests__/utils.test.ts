import { getExecutionSequence, createSequences, createIndegrees, createDependents } from '../utils';

describe('unit utils test', () => {
  describe('getExecutionSequence', () => {
    it('should return correct order for simple dependencies', () => {
      const dependencies = {
        users: [],
        projects: ['users'],
        tasks: ['projects'],
      };
      expect(getExecutionSequence(dependencies)).toEqual([['users'], ['projects'], ['tasks']]);
    });

    it('should handle parallel dependencies', () => {
      const dependencies = {
        users: [],
        projects: [],
        tasks: ['users', 'projects'],
      };
      expect(getExecutionSequence(dependencies)).toEqual([['users', 'projects'], ['tasks']]);
    });

    it('should throw for circular dependencies', () => {
      const dependencies = {
        users: ['projects'],
        tasks: ['users'],
        projects: ['tasks'],
      };
      expect(() => getExecutionSequence(dependencies)).toThrow('Cycle detected in dependencies');
    });

    it('should throw for circular dependencies 2', () => {
      const dependencies = {
        users: ['projects'],
        tasks: ['users'],
        projects: ['tasks'],
        comments: [],
        workspace: ['comments'],
      };
      expect(() => getExecutionSequence(dependencies)).toThrow('Cycle detected in dependencies');
    });

    it('should call all methods if dependencies are empty', () => {
      const dependencies = {
        users: [],
        projects: [],
        tasks: [],
      };
      expect(getExecutionSequence(dependencies)).toEqual([['users', 'projects', 'tasks']]);
    });

    it('should handle this example', () => {
      const dependencies = {
        users: [],
        projects: [],
        tasks: ['projects'],
      };
      expect(getExecutionSequence(dependencies)).toEqual([['users', 'projects'], ['tasks']]);
    });

    it('should handle this case where the one is dependent on the others', () => {
      const dependencies = {
        users: [],
        projects: ['users'],
        tasks: ['users'],
      };
      expect(getExecutionSequence(dependencies)).toEqual([['users'], ['projects', 'tasks']]);
    });

    it('should handle this many dependencies', () => {
      const dependencies = {
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
      const dependencies = {
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
      const dependencies = {
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
      const dependencies = {
        users: ['projects'],
        tasks: ['users'],
        projects: ['tasks'],
        comments: ['workspaces'],
        workspaces: ['users'],
      };
      expect(() => getExecutionSequence(dependencies)).toThrow('Cycle detected in dependencies');
    });

    it('should handle deep dependency chains', () => {
      const dependencies = {
        a: ['b'],
        b: ['c'],
        c: ['d'],
        d: ['e'],
        e: [],
      };
      expect(getExecutionSequence(dependencies)).toEqual([['e'], ['d'], ['c'], ['b'], ['a']]);
    });

    it('should handle more nested dependencies', () => {
      const dependencies = {
        a: [],
        b: ['a', 'd'],
        c: ['b', 'd'],
        d: ['a'],
      };
      expect(getExecutionSequence(dependencies)).toEqual([['a'], ['d'], ['b'], ['c']]);
    });

    it('should throw for self-dependencies', () => {
      const dependencies = {
        a: ['a'],
        b: [],
      };
      expect(() => getExecutionSequence(dependencies)).toThrow('Cycle detected in dependencies');
    });

    it('should detect cycles in partial graphs', () => {
      const dependencies = {
        a: ['b'],
        b: ['c'],
        c: ['a'],
        d: [],
        e: ['d'],
      };
      expect(() => getExecutionSequence(dependencies)).toThrow('Cycle detected in dependencies');
    });
  });

  describe('createSequences', () => {
    it('should return correct stages for simple graph', () => {
      const dependencies = {
        users: [],
        tasks: ['users'],
      };
      const indegrees = {
        users: 0,
        tasks: 1,
      };
      const dependents = {
        users: ['tasks'],
        tasks: [],
      };

      const stages = createSequences(dependencies, dependents, indegrees);
      expect(stages).toEqual([['users'], ['tasks']]);
    });

    it('should throw on cyclic graph', () => {
      const dependencies = {
        users: ['tasks'],
        tasks: ['users'],
      };
      const indegrees = {
        users: 1,
        tasks: 1,
      };
      const dependents = {
        users: ['tasks'],
        tasks: ['users'],
      };

      expect(() => createSequences(dependencies, dependents, indegrees)).toThrow(
        'Cycle detected in dependencies',
      );
    });
  });

  describe('createIndegrees', () => {
    it('should calculate indegrees correctly for a simple graph', () => {
      const dependencies = {
        users: [],
        projects: ['users'],
        tasks: ['users', 'projects'],
      };

      const indegrees = createIndegrees(dependencies);

      expect(indegrees).toEqual({
        users: 0,
        projects: 1,
        tasks: 2,
      });
    });

    it('should handle nodes with no dependencies', () => {
      const dependencies = {
        a: [],
        b: [],
        c: [],
      };

      const indegrees = createIndegrees(dependencies);

      expect(indegrees).toEqual({
        a: 0,
        b: 0,
        c: 0,
      });
    });

    it('should handle an empty dependency graph', () => {
      const dependencies = {};
      const indegrees = createIndegrees(dependencies);
      expect(indegrees).toEqual({});
    });

    it('should handle more nested dependencies', () => {
      const dependencies = {
        a: [],
        b: ['a', 'd'],
        c: ['b', 'd'],
        d: ['a'],
      };
      const indegrees = createIndegrees(dependencies);

      expect(indegrees).toEqual({
        a: 0,
        b: 2,
        c: 2,
        d: 1,
      });
    });
  });

  describe('createDependents', () => {
    it('should build dependents correctly for a simple graph', () => {
      const dependencies = {
        users: [],
        projects: ['users'],
        tasks: ['users', 'projects'],
      };

      const dependents = createDependents(dependencies);

      expect(dependents).toEqual({
        users: ['projects', 'tasks'],
        projects: ['tasks'],
        tasks: [],
      });
    });

    it('should handle nodes with no dependencies', () => {
      const dependencies = {
        a: [],
        b: [],
        c: [],
      };

      const dependents = createDependents(dependencies);

      expect(dependents).toEqual({
        a: [],
        b: [],
        c: [],
      });
    });

    it('should handle an empty dependency graph', () => {
      const dependencies = {};
      const dependents = createDependents(dependencies);
      expect(dependents).toEqual({});
    });
  });
});
