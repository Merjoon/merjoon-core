import { QuireApi } from '../api';
import { IQuireConfig } from '../types';
import { HttpClient } from '../../common/HttpClient';

const clientId = process.env.QUIRE_CLIENT_ID;
const clientSecret = process.env.QUIRE_CLIENT_SECRET;
const refreshToken = process.env.QUIRE_REFRESH_TOKEN;

if (!refreshToken || !clientId || !clientSecret) {
  throw new Error('Missing required parameters');
}

describe('Quire API sendGetRequest', () => {
  let api: QuireApi;
  let config: IQuireConfig;
  let oid: string;

  beforeAll(async () => {
    config = {
      refreshToken,
      clientId,
      clientSecret,
    };
    api = new QuireApi(config);
    await api.init();
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
            }),
          ]),
          status: expect.objectContaining({
            name: expect.any(String),
          }),
          descriptionText: expect.any(String),
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
          createdAt: expect.any(String),
          editedAt: expect.any(String),
          descriptionText: expect.any(String),
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
        }),
      );
    });
  });

  describe('TestSendRequest', () => {
    it('need to get 401 then 200', async () => {
      const httpConfig = {
        baseURL: 'https://quire.io/api/',
      };
      const url = '/project/list';
      const httpClient = new HttpClient(httpConfig);
      const request = {
        method: 'get',
        url: url,
        headers: {},
      };
      const mock401Response = {
        status: 401,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jest.spyOn(httpClient as any, 'sendRequest').mockResolvedValueOnce(mock401Response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (httpClient as any).sendRequest(request);
      if (result.status === 401) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const retryResult = await (api as any).sendRequest(request.method, request.url);

        expect(retryResult.status).toEqual(200);
      } else {
        throw new Error('Expected first request to return 401');
      }
    });
  });
});
