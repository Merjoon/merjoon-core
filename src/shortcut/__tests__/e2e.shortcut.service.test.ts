import { IMerjoonUsers, IMerjoonTasks } from '../../common/types';
import { ID_REGEX } from '../../utils/regex';
import { getShortcutService } from '../shortcut-service';
import { ShortcutService } from '../service';

describe('Shortcut ', () => {
  let service: ShortcutService;

  beforeEach(() => {
    service = getShortcutService();
  });

  it('getUsers', async () => {
    const users: IMerjoonUsers = await service.getUsers();

    expect(Object.keys(users[0])).toEqual(
      expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'created_at',
        'modified_at',
        'email_address', 
        'remote_created_at',
        'remote_modified_at',
      ])
    );

    expect(users[0]).toEqual({
      id: expect.stringMatching(ID_REGEX),
      remote_id: expect.any(String),
      name: expect.any(String),
      created_at: expect.any(Number),
      modified_at: expect.any(Number),
      email_address: expect.any(String),
      remote_created_at: expect.any(String),
      remote_modified_at: expect.any(String),
    });
  });

  it('getTasks', async () => {
    const tasks: IMerjoonTasks = await service.getTasks();

    expect(Object.keys(tasks[0])).toEqual(
      expect.arrayContaining([
        'id',
        'remote_id',
        'name',
        'assignees',
        'status',
        'description',
        'projects',
        'remote_created_at',
        'remote_modified_at',
        'created_at',
        'modified_at',
        'ticket_url'
      ])
    );

    expect(tasks[0]).toEqual({
      id: expect.stringMatching(ID_REGEX),
      created_at: expect.any(Number),
      modified_at: expect.any(Number),
      remote_id: expect.any(String),
      name: expect.any(String),
      assignees: expect.any(Array),
      status: expect.any(String),
      description: expect.any(String),
      projects: expect.any(Array),
      remote_created_at: expect.any(Number),
      remote_modified_at: expect.any(Number),
      ticket_url: expect.any(String)
    });
  });
});