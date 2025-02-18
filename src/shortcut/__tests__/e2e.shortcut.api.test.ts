import {ShortcutApi} from '../api';
import {IShortcutConfig, IShortcutMember, IShortcutStory, IShortcutWorkflow} from '../types';

describe('e2e ShortcutApi', () => {
  let api: ShortcutApi;
  const config: IShortcutConfig= {
    token:process.env.SHORTCUT_TOKEN ?? '',
  };

  beforeEach(() => {
    api = new ShortcutApi(config);
  });
  afterEach(async () => {
    jest.restoreAllMocks();
  });

  function testPagination<T>(getMethod: () => Promise<T[]>,entityName: string) {
    it(`should iterate over all ${entityName} and fetch all pages`, async () => {
      const spy = jest.spyOn(api, 'getAllStories');
      const allEntities = await getMethod();
      const expectedCallCount = Math.ceil(allEntities.length / 25);
      const recordSpy = spy.mock.calls.length;
      expect([recordSpy, recordSpy - 1]).toContain(expectedCallCount);

      jest.restoreAllMocks();
    });
  }
  describe('test stories pagination', () => {
    testPagination(() => api.getAllStories(), 'stories');
  });

  it('getMembers', async () => {
    const members :IShortcutMember[] = await api.getMembers();

    expect(members[0]).toEqual(expect.objectContaining({
      id: expect.any(String),
      profile: expect.objectContaining({
        name: expect.any(String),
        email_address: expect.any(String),
      }),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    }));
  });

  it('getStories', async () => {
    const stories : IShortcutStory[] = await api.getAllStories();

    expect(Array.isArray(stories)).toBe(true);
    expect(stories.length).toBeGreaterThan(0);
    expect(stories[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
      name: expect.any(String),
      owner_ids:expect.any(Array),
      description:expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      app_url:expect.any(String),
      workflow_id: expect.any(Number),
      workflow_state_id: expect.any(Number),
    }));
  });

  it('getWorkflows', async () => {
    const workflows: IShortcutWorkflow[] = await api.getWorkflows();

    expect(workflows[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      states: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        })
      ])
    }));
  });
});