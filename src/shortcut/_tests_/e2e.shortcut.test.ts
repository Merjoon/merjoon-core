import {ShortcutApi} from '../api';
import {IShortcutConfig} from '../types';
import dotenv from 'dotenv';

describe('e2e ShortcutApi', () => {
  let api: ShortcutApi;
  dotenv.config({ path: '.test.env' });
  const config: IShortcutConfig= {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    token:process.env.SHORTCUT_TOKEN!,
  };

  beforeEach(() => {
    api = new ShortcutApi(config);
  });

  it('getMembers', async () => {
    const members = await api.getAllMembers();
    
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
    const stories = await api.getAllStories();
    expect(stories[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
      name: expect.any(String),
      owner_ids:expect.any(Array),
      description:expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      app_url:expect.any(String),
    }));
  });
});