import {ShortcutApi} from '../api';
import {IShortcutMember, IShortcutWorkflow} from '../types';
const token = process.env.SHORTCUT_TOKEN;
if (!token) {
  throw new Error('There is no token');
}

describe('e2e ShortcutApi', () => {
  let api: ShortcutApi;

  beforeEach(() => {
    const config= {
      token: token,
    };
    api = new ShortcutApi(config);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('test stories pagination', () => {
    it('should iterate over all stories and fetch all pages', async () => {
      const getAllStoriesSpy = jest.spyOn(api, 'getAllStories');
      const getStoriesSpy = jest.spyOn(api, 'getStories');
      const getNextSpy = jest.spyOn(api, 'getNext');

      const allEntities = await api.getAllStories();
      const expectedCallCount = Math.floor(allEntities.length / 10);
      const getAllStoriesCount = getAllStoriesSpy.mock.calls.length;
      const getStoriesCount = getStoriesSpy.mock.calls.length;
      const getNextCount = getNextSpy.mock.calls.length;

      expect(getStoriesCount).toBe(1);
      expect(getAllStoriesCount).toBe(1);
      expect(getNextCount).toBe(expectedCallCount);

      jest.restoreAllMocks();
    });
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
    const stories = await api.getStories();

    expect(stories.data[0]).toEqual(expect.objectContaining({
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