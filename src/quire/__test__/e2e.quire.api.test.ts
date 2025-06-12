import { QuireApi } from '../api';
import { IQuireConfig } from '../types';

const clientId = process.env.QUIRE_CLIENT_ID;
const clientSecret = process.env.QUIRE_CLIENT_SECRET;
const refreshToken = process.env.QUIRE_REFRESH;

if (!refreshToken || !clientId || !clientSecret) {
  throw new Error('Missing required parameters');
}

describe('Quire API sendGetRequest', () => {
  let api: QuireApi;
  let config: IQuireConfig;
  let oid: string;

  beforeAll(async () => {
    config = {
      token: 'invalid_token',
      refreshToken,
      clientId,
      clientSecret,
    };

    api = new QuireApi(config);
    const projects = await api.getProjects();
    oid = projects[0].oid;
  });
  describe('getTasks', () => {
    it('should parse Tasks data correctly', async () => {
      const tasks = await api.getTasks(oid);

      expect(tasks[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          createdAt: expect.any(String),
          editedAt: expect.any(String),
          assignees: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              oid: expect.any(String),
            }),
          ]),
          status: expect.objectContaining({
            value: expect.any(Number),
            name: expect.any(String),
            color: expect.any(String),
          }),
          description: expect.any(String),
          url: expect.any(String),
        }),
      );
    });
  });

  describe('getProjects', () => {
    it('should parse Projects data correctly', async () => {
      const projects = await api.getProjects();

      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          oid: expect.any(String),
          createdAt: expect.any(String),
          editedAt: expect.any(String),
          description: expect.any(String),
        }),
      );
    });
  });

  describe('getUsers', () => {
    it('should parse Users data correctly', async () => {
      const users = await api.getUsers();

      expect(users[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          oid: expect.any(String),
          description: expect.any(String),
          image: expect.any(String),
        }),
      );
    });
  });

  describe('getNewToken', () => {
    it('should refresh the access token and change it from the old one', async () => {
      const oldToken = api.accessToken;

      await api.refreshAccessToken();

      expect(api.accessToken).toBeDefined();
      expect(api.accessToken).not.toEqual('');
      expect(api.accessToken).not.toEqual(oldToken);
    });
  });
});
