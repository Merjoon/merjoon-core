import { IFreedcampTask } from '../types';
import { FreedcampApi } from '../api';

describe('normalizeAssignedIds', () => {
  it('should clear assigned_ids if it contains only "0"', async () => {
    const task: IFreedcampTask = {
      id: '62784728',
      title: 'Task2',
      status_title: 'In Progress',
      assigned_ids: ['0'],
      project_id: '3639d98ff2b3a5d1eda110dea4a6bd83',
      description: 'Very important task',
      created_ts: 1754398440434,
      updated_ts: 1754398440434,
      url: 'https://freedcamp.com/view/3543358/tasks/62784728',
    };
    FreedcampApi.normalizeAssignedIds(task);
    expect(task).toEqual({
      id: '62784728',
      title: 'Task2',
      status_title: 'In Progress',
      assigned_ids: [],
      project_id: '3639d98ff2b3a5d1eda110dea4a6bd83',
      description: 'Very important task',
      created_ts: 1754398440434,
      updated_ts: 1754398440434,
      url: 'https://freedcamp.com/view/3543358/tasks/62784728',
    });
  });

  it('should keep assigned_ids unchanged if it contains valid Ids', async () => {
    const task: IFreedcampTask = {
      id: '62784728',
      title: 'Task5',
      status_title: 'In Progress',
      assigned_ids: ['2243972'],
      project_id: '3639d98ff2b3a5d1eda110dea4a6bd83',
      description: 'Very important task',
      created_ts: 1754398440434,
      updated_ts: 1754398440434,
      url: 'https://freedcamp.com/view/3543358/tasks/62784728',
    };
    FreedcampApi.normalizeAssignedIds(task);
    expect(task).toEqual({
      id: '62784728',
      title: 'Task5',
      status_title: 'In Progress',
      assigned_ids: ['2243972'],
      project_id: '3639d98ff2b3a5d1eda110dea4a6bd83',
      description: 'Very important task',
      created_ts: 1754398440434,
      updated_ts: 1754398440434,
      url: 'https://freedcamp.com/view/3543358/tasks/62784728',
    });
  });
});
