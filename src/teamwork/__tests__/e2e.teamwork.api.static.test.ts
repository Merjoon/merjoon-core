import { TeamworkApi } from '../api';
import { ITeamworkResponse } from '../types';

describe('processData function', () => {
  it('should transform the input data correctly when there is an included field', () => {
    const data: ITeamworkResponse = {
      tasks: [
        {
          id: 33582145,
          name: 'Task 8',
          description:
            'Register\nCreate 2 projects- not needed\nCreate 1 more user\nCreate 5 statuses/columns\nCreate and distribute 10 tasks randomly among the columns\nAssign randomly or leave Unassigned\nProvide credentials',
          updatedAt: '2025-03-19T07:46:33Z',
          hasDeskTickets: false,
          displayOrder: 2007,
          crmDealIds: null,
          card: {
            id: 1948821,
            type: 'cards',
          },
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
          createdAt: '2024-05-01T21:20:26Z',
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
            createdAt: '2024-08-22T06:50:19Z',
            column: {
              id: 533792,
              type: 'columns',
            },
          },
        },
        columns: {
          533792: {
            id: 533792,
            name: 'In Progress',
            color: '#397E48',
            displayOrder: 2000,
            createdAt: '2024-05-06T14:57:29Z',
            deletedAt: null,
            project: {
              id: 886060,
              type: 'projects',
            },
          },
        },
        users: {
          554328: {
            id: 554328,
            firstName: 'test28',
            lastName: 'test28',
            email: 'teamworkapi@gmail.com',
            createdAt: '2024-05-06T14:57:29Z',
            updatedAt: '2024-05-06T14:57:29Z',
          },
          554326: {
            id: 554326,
            firstName: 'test26',
            lastName: 'test26',
            email: 'teamworkapi@gmail.com',
            createdAt: '2024-05-06T14:57:29Z',
            updatedAt: '2024-05-06T14:57:29Z',
          },
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
          hasDeskTickets: false,
          displayOrder: 2007,
          crmDealIds: null,
          card: {
            id: 1948821,
            displayOrder: 2,
            archived: 'false',
            archivedAt: null,
            createdAt: '2024-08-22T06:50:19Z',
            column: {
              id: 533792,
              name: 'In Progress',
              color: '#397E48',
              displayOrder: 2000,
              createdAt: '2024-05-06T14:57:29Z',
              deletedAt: null,
              project: {
                id: 886060,
                type: 'projects',
              },
            },
          },
          assigneeUsers: [
            {
              firstName: 'test28',
              id: 554328,
              lastName: 'test28',
              email: 'teamworkapi@gmail.com',
              createdAt: '2024-05-06T14:57:29Z',
              updatedAt: '2024-05-06T14:57:29Z',
            },
            {
              firstName: 'test26',
              id: 554326,
              lastName: 'test26',
              email: 'teamworkapi@gmail.com',
              createdAt: '2024-05-06T14:57:29Z',
              updatedAt: '2024-05-06T14:57:29Z',
            },
          ],
          createdAt: '2024-05-01T21:20:26Z',
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
  it('should correctly transform data without included', () => {
    const data: ITeamworkResponse = {
      tasks: [
        {
          id: 33582145,
          name: 'Task 8',
          description:
            'Register\nCreate 2 projects- not needed\nCreate 1 more user\nCreate 5 statuses/columns\nCreate and distribute 10 tasks randomly among the columns\nAssign randomly or leave Unassigned\nProvide credentials',
          updatedAt: '2025-03-19T07:46:33Z',
          hasDeskTickets: false,
          displayOrder: 2007,
          crmDealIds: null,
          card: {
            id: 1948821,
            type: 'cards',
          },
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
          createdAt: '2024-05-01T21:20:26Z',
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
          hasDeskTickets: false,
          displayOrder: 2007,
          crmDealIds: null,
          card: {
            id: 1948821,
            type: 'cards',
          },
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
          createdAt: '2024-05-01T21:20:26Z',
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
