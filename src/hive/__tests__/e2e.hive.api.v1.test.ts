import { HiveApiV1 } from '../api/api-v1';
import { IHive1Config } from '../types';

const token = process.env.HIVE_API_KEY;
if (!token) {
  throw new Error('Hive token is not set in the environment variables');
}

describe('HiveV1 API', () => {
  let hive: HiveApiV1;
  let config: IHive1Config;

  beforeEach(async () => {
    config = {
      apiKey: token,
    };
    hive = new HiveApiV1(config);
  });

  describe('getWorkspaces', () => {
    it('should parse group data correctly', async () => {
      const workspaces = await hive.getWorkspaces();
      expect(workspaces.length).toBeGreaterThan(0);
      expect(workspaces[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
        }),
      );
    });
  });

  describe('getUsers', () => {
    it('should parse group data correctly', async () => {
      const users = await hive.getUsers();
      expect(users.length).toBeGreaterThan(0);
      expect(users[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          fullName: expect.any(String),
          email: expect.any(String),
        }),
      );
    });
  });
});
