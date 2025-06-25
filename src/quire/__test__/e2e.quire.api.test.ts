import { QuireApi } from '../api';
import { HttpClient } from '../../common/HttpClient';
import { IMerjoonHttpClient } from '../../common/types';
import { IQuireConfig } from '../types';
const clientId = process.env.QUIRE_CLIENT_ID;
const clientSecret = process.env.QUIRE_CLIENT_SECRET;
const refreshToken = process.env.QUIRE_REFRESH_TOKEN;

if (!refreshToken || !clientId || !clientSecret) {
  throw new Error('Missing required parameters');
}

describe('Quire API sendGetRequest', () => {
  let api: QuireApi;
  let config: IQuireConfig;
  let oid: string[];

  interface IProtectedHttpClient extends IMerjoonHttpClient {
    sendRequest: HttpClient['sendRequest'];
  }
  type IHttpClient = IProtectedHttpClient & typeof HttpClient;
  interface IProtectedQuire extends IMerjoonHttpClient {
    sendRequest: QuireApi['sendRequest'];
  }
  type IQuire = IProtectedQuire & typeof QuireApi;

  beforeAll(async () => {
    config = {
      refreshToken,
      clientId,
      clientSecret,
    };
    api = new QuireApi(config);
    await api.init();
  });
  describe('getTasks', () => {
    beforeEach(async () => {
      const projects = await api.getProjects();
      oid = [projects[0].oid];
    });
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
  describe('sendRequest', () => {
    it('should return 401 (mocked) and then real 200 (not mocked)', async () => {
      const url = 'https://quire.io/api/project/list';

      const parameters: Parameters<HttpClient['sendRequest']> = ['GET', url];
      const request = {
        method: parameters[0],
        url,
        headers: {},
      };

      const mock401Response = {
        status: 401,
        data: null,
        headers: {},
      };
      jest
        .spyOn(HttpClient.prototype as unknown as IHttpClient, 'sendRequest')
        .mockResolvedValueOnce(mock401Response);

      const result = await (HttpClient.prototype as unknown as IHttpClient).sendRequest(
        request.method,
        request.url,
      );
      expect(result.status).toEqual(401);

      const realResponse = await (api as unknown as IQuire).sendRequest(
        request.method,
        request.url,
      );

      expect(realResponse.status).toBe(200);
    });
  });
});
