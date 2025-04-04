import { TeamworkApi } from '../api';

describe('processData function', () => {
  it('should transform the input data correctly', () => {
    const data = {
      tasks: [
        {
          id: 33582145,
          name: 'Task 8',
          description:
            'Register\nCreate 2 projects- not needed\nCreate 1 more user\nCreate 5 statuses/columns\nCreate and distribute 10 tasks randomly among the columns\nAssign randomly or leave Unassigned\nProvide credentials',
          updatedAt: '2025-03-19T07:46:33Z',
          card: {
            id: 1948821,
            type: 'cards',
          },
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
          createdAt: '2024-05-01T21:20:26Z',
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
        },
      ],
      meta: {
        page: {
          pageOffset: 0,
          pageSize: 50,
          count: 34,
          hasMore: false,
        },
      },
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
        users: {
          554328: { id: 554328, firstName: 'test28', lastName: 'test28' },
          554326: { id: 554326, firstName: 'test26', lastName: 'test26' },
        },
      },
    };
    const result = TeamworkApi.transformResponse(data);
    expect(result).toEqual({
      items: [
        {
          id: 33582145,
          name: 'Task 8',
          description:
            'Register\nCreate 2 projects- not needed\nCreate 1 more user\nCreate 5 statuses/columns\nCreate and distribute 10 tasks randomly among the columns\nAssign randomly or leave Unassigned\nProvide credentials',
          updatedAt: '2025-03-19T07:46:33Z',
          card: {
            id: 1948821,
            displayOrder: 2,
            archived: 'false',
            archivedAt: null,
            archivedBy: null,
            createdAt: '2024-08-22T06:50:19Z',
            createBy: { id: 554326, firstName: 'test26', lastName: 'test26' },
            updatedAt: '2025-03-19T07:46:33Z',
            visible: 'true',
            status: 'ACTIVE',
            column: {
              id: 533792,
              name: 'In Progress',
              color: '#397E48',
              displayOrder: 2000,
              createdAt: '2024-05-06T14:57:29Z',
              updatedAt: '2025-03-19T07:46:33Z',
              sort: 'manual',
              sortOrder: 'ASC',
              deletedAt: null,
              project: { id: 886060, type: 'projects' },
              hasTriggers: false,
              deleted: false,
              stats: { total: 0, completed: 0, active: 0, estimatedTime: 0 },
              defaultTasklist: null,
            },
            deleteBy: null,
            deletedAt: null,
          },
          assignees: [
            {
              firstName: 'test28',
              id: 554328,
              lastName: 'test28',
            },
            {
              firstName: 'test26',
              id: 554326,
              lastName: 'test26',
            },
          ],
          createdAt: '2024-05-01T21:20:26Z',
          assigneeUsers: [
            {
              firstName: 'test28',
              id: 554328,
              lastName: 'test28',
            },
            {
              firstName: 'test26',
              id: 554326,
              lastName: 'test26',
            },
          ],
        },
      ],
      meta: {
        page: {
          pageOffset: 0,
          pageSize: 50,
          count: 34,
          hasMore: false,
        },
      },
    });
  });
});
