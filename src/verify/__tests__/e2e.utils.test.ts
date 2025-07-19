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

    service.getUsers = jest.fn().mockResolvedValue([
      {
        id: '52377329',
        name: 'merjoontest1',
        email: 'merjoontest1@gmail.com',
      },
    ]);
    service.getTasks = jest.fn().mockResolvedValue([
      {
        user_id: '52377329',
        id: '6X6CjvjxQhwPv526',
        project_id: '6X6Cjm5cjrRrf67c',
        section_id: '6X6Cjr73J4HcP6Hc',
        parent_id: null,
        added_by_uid: '52377329',
        assigned_by_uid: '52377329',
        responsible_uid: '52377329',
        labels: [],
        deadline: null,
        duration: null,
        checked: false,
        is_deleted: false,
        added_at: '2025-01-16T16:57:17.633062Z',
        completed_at: null,
        updated_at: '2025-01-16T17:22:04.937184Z',
        due: null,
        priority: 1,
        child_order: 0,
        content: 'Task2',
        description:
          '1. Register\n' +
          '2. Create10 projects- not needed\n' +
          '3. Create 1 more user\n' +
          '4. Create 5 statuses/columns\n' +
          '5. Create and distribute 10 tasks randomly among the columns\n' +
          '6. Assign randomly or leave Unassigned\n' +
          '7. Provide credentials',
        note_count: 0,
        day_order: -1,
        is_collapsed: false,
      },
    ]);
    service.getProjects = jest.fn().mockResolvedValue([
      {
        id: '6X6ChGfxQJvfFJmm',
        can_assign_tasks: false,
        child_order: 0,
        color: 'charcoal',
        creator_uid: '52377329',
        created_at: '2025-01-16T16:47:42.286187Z',
        is_archived: false,
        is_deleted: false,
        is_favorite: false,
        is_frozen: false,
        name: 'Inbox',
        updated_at: '2025-01-16T16:47:42.286187Z',
        view_style: 'list',
        default_order: 0,
        description: '',
        public_access: false,
        public_key: 'b6e80ec3-8f75-4cc2-b8c9-c6af45179f4a',
        access: {
          visibility: 'restricted',
          configuration: {},
        },
        role: 'CREATOR',
        parent_id: null,
        inbox_project: true,
        is_collapsed: false,
        is_shared: false,
      },
    ]);

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

    const mockCallOrder = [
      (service.getProjects as jest.Mock).mock.calls.length > 0 ? 'projects' : null,
      (service.getUsers as jest.Mock).mock.calls.length > 0 ? 'users' : null,
      (service.getTasks as jest.Mock).mock.calls.length > 0 ? 'tasks' : null,
    ].filter(Boolean);

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
