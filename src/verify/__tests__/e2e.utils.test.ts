import fs from 'node:fs/promises';
import { fetchEntitiesInSequence } from '../utils';
import { EntityName, INodeAdjacency, IntegrationId } from '../types';
import { getTodoistService } from '../../todoist/todoist-service';
import { TodoistService } from '../../todoist/service';

jest.mock('node:fs/promises');

describe('e2e utils', () => {
  let service: TodoistService;
  beforeEach(async () => {
    jest.clearAllMocks();
    service = getTodoistService();
    await service.init();

    service.getUsers = jest.fn().mockResolvedValue([]);
    service.getProjects = jest.fn().mockResolvedValue([]);
    service.getTasks = jest.fn().mockResolvedValue([]);
  });

  describe('fetchEntitiesInOrder', () => {
    it('should call methods in correct dependency order', async () => {
      const dependencies: INodeAdjacency<EntityName> = {
        projects: [],
        users: ['projects'],
        tasks: [],
      };

      await fetchEntitiesInSequence(service, IntegrationId.Todoist, dependencies);

      const projectsCallOrder = (service.getProjects as jest.Mock).mock.invocationCallOrder[0];
      const tasksCallOrder = (service.getTasks as jest.Mock).mock.invocationCallOrder[0];
      expect(projectsCallOrder).toBeLessThan(tasksCallOrder);
      expect(service.getUsers).toHaveBeenCalled();

      expect(fs.writeFile).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('.transformed/todoist/projects.json'),
        expect.any(String),
      );

      expect(fs.writeFile).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('.transformed/todoist/tasks.json'),
        expect.any(String),
      );

      expect(fs.writeFile).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining('.transformed/todoist/users.json'),
        expect.any(String),
      );
    });
  });
});
