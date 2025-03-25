import { TeamworkApi } from '../api';
import { ITeamworkConfig, ITeamworkPeople, ITeamworkProject, ITeamworkTask } from '../types';
const token = process.env.TEAMWORK_TOKEN;
const password = process.env.TEAMWORK_PASSWORD;
const subdomain = process.env.TEAMWORK_SUBDOMAIN;
if (!token || !password || !subdomain) {
  throw new Error('There is no token or password or subdomain');
}

describe('e2e TeamworkApi', () => {
  let api: TeamworkApi;
  let config: ITeamworkConfig;
  beforeEach(() => {
    config = {
      token: token,
      password: password,
      subdomain: subdomain,
      limit: 1,
    };
    api = new TeamworkApi(config);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllProjects', () => {
    it('should iterate over all projects, fetch all pages and parse project data correctly', async () => {
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const allProjects: ITeamworkProject[] = await api.getAllProjects();
      const expectedCallCount = Math.ceil(allProjects.length / config.limit);
      expect(getRecordsSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);

      expect(allProjects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });

  describe('getAllPeople', () => {
    it('should iterate over all people, fetch all pages and parse people data correctly', async () => {
      const getRecordsSpy = jest.spyOn(api, 'getRecords');
      const allPeople: ITeamworkPeople[] = await api.getAllPeople();
      const expectedCallCount = Math.ceil(allPeople.length / config.limit);
      expect(getRecordsSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
      expect(allPeople[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });

  describe('getAllTasks', () => {
    it('should iterate over all tasks, fetch all pages and parse task data correctly', async () => {
      config.limit = 5;
      const api = new TeamworkApi(config);
      const getRecordsSpy = jest.spyOn(api, 'getRecords');

      getRecordsSpy.mockClear();
      const allTasks: ITeamworkTask[] = await api.getAllTasks();
      const expectedCallCount = Math.ceil(allTasks.length / config.limit);
      expect(getRecordsSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);
      expect(allTasks[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          assigneeUsers: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
            }),
          ]),
          status: expect.any(String),
          description: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });
  describe('processData function', () => {
    it('should transform the input data correctly', () => {
      const data = {
        tasks: [
          {
            id: 33582145,
            name: 'Task 8',
            description:
              'Register\nCreate 2 projects- not needed\nCreate 1 more user\nCreate 5 statuses/columns\nCreate and distribute 10 tasks randomly among the columns\nAssign randomly or leave Unassigned\nProvide credentials',
            descriptionContentType: 'TEXT',
            priority: null,
            hasDeskTickets: false,
            progress: 0,
            displayOrder: 2007,
            decimalDisplayOrder: 2007,
            crmDealIds: null,
            tagIds: null,
            tags: null,
            updatedAt: '2025-03-19T07:46:33Z',
            updatedBy: 554326,
            parentTask: null,
            card: {
              id: 1948821,
              type: 'cards',
            },
            isPrivate: 0,
            lockdown: null,
            status: 'new',
            tasklist: {
              id: 2939041,
              type: 'tasklists',
            },
            startDate: null,
            dueDate: '2024-05-23T00:00:00Z',
            startDateOffset: null,
            dueDateOffset: null,
            estimateMinutes: 0,
            accumulatedEstimatedMinutes: 0,
            assignees: [
              {
                id: 554328,
                type: 'users',
              },
              {
                id: 554326,
                type: 'users',
              },
            ],
            commentFollowers: [],
            changeFollowers: [],
            attachments: [],
            notify: false,
            isArchived: false,
            capacities: null,
            proofs: null,
            userPermissions: {
              canEdit: true,
              canComplete: true,
              canLogTime: true,
              canViewEstTime: true,
              canAddSubtasks: true,
            },
            createdBy: 554326,
            createdAt: '2024-05-01T21:20:26Z',
            sequence: null,
            dateUpdated: '2024-08-22T06:50:19Z',
            parentTaskId: 0,
            tasklistId: 2939041,
            assigneeUserIds: [554328, 554326],
            assigneeUsers: [
              {
                id: 554328,
                type: 'users',
              },
              {
                id: 554326,
                type: 'users',
              },
            ],
            assigneeCompanyIds: null,
            assigneeCompanies: [],
            assigneeTeamIds: null,
            assigneeTeams: [],
            createdByUserId: 554326,
            sequenceId: null,
          },
        ],
        included: {
          cards: {
            1948821: {
              id: 1948821,
              displayOrder: 2,
              archived: 'false',
              archivedAt: null,
              archivedBy: null,
              createdAt: '2024-08-22T06:50:19Z',
              createBy: {
                id: 554326,
                type: 'users',
              },
              updatedAt: '2025-03-19T07:46:33Z',
              visible: 'true',
              status: 'ACTIVE',
              column: {
                id: 533792,
                type: 'columns',
              },
              deleteBy: null,
              deletedAt: null,
            },
          },
          columns: {
            533792: {
              id: 533792,
              name: 'In Progress',
              color: '#397E48',
              displayOrder: 2000,
              createdAt: '2024-05-06T14:57:29Z',
              updatedAt: '2025-03-19T07:46:33Z',
              settings: {
                name: true,
                subtasklabel: true,
                subtasktext: true,
                tasklist: true,
                assignee: true,
                avatar: true,
                startAt: true,
                endAt: true,
                tags: true,
                files: true,
                estimatedtime: true,
                progress: true,
                dependencies: true,
                time: true,
                priority: true,
                comments: true,
                reminders: true,
                tickets: true,
                followers: true,
                recurring: true,
                private: true,
              },
              sort: 'manual',
              sortOrder: 'ASC',
              deletedAt: null,
              project: {
                id: 886060,
                type: 'projects',
              },
              hasTriggers: false,
              deleted: false,
              stats: {
                total: 0,
                completed: 0,
                active: 0,
                estimatedTime: 0,
              },
              defaultTasklist: null,
            },
          },
        },
      };
      const result = TeamworkApi.processData(data);
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      );
    });
  });
});
