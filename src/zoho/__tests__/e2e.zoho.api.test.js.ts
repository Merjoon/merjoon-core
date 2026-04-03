import { ZohoApi } from '../api';
import { IZohoConfig } from '../types';
import { HttpMethod, IMerjoonHttpClient } from '../../common/types';
import { HttpErrorDetails } from '../../common/HttpError';
import { HttpClient } from '../../common/HttpClient';
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
const domain = process.env.ZOHO_DOMAIN;

if (!refreshToken || !clientId || !clientSecret || !domain) {
  throw new Error('Missing required parameters');
}
interface IProtectedHttpClient extends IMerjoonHttpClient {
  sendRequest: HttpClient['sendRequest'];
}
type IHttpClient = IProtectedHttpClient & typeof HttpClient;
interface IProtectedQuire extends IMerjoonHttpClient {
  sendRequest: ZohoApi['sendRequest'];
}
type IZoho = IProtectedQuire & typeof ZohoApi;

describe('Zoho API sendRequest', () => {
  let api: ZohoApi;
  let config: IZohoConfig;

  beforeEach(() => {
    config = {
      refreshToken,
      clientId,
      clientSecret,
      domain,
    };
    api = new ZohoApi(config);
  });

  describe('getUsers', () => {
    beforeEach(async () => {
      await api.init();
    });

    it('should parse Users data correctly', async () => {
      const portals = await api.getPortals();
      const portalId = portals.portals[0].id;
      const users = await api.getUsers(portalId);
      const user = users.users[0];

      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
        }),
      );
    });
  });

  describe('sendRequest', () => {
    beforeEach(async () => {
      await api.init();
    });

    it('if token is expired, update it', async () => {
      const url = `https://projectsapi.zoho.${domain}/restapi/portals/`;
      const request = {
        method: 'get' as HttpMethod,
        url,
        headers: {},
      };

      const mock401Response: HttpErrorDetails = {
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
      const realResponse = await (api as unknown as IZoho).sendRequest(request.method, request.url);
      expect(result.status).toEqual(401);
      expect(realResponse).toBeDefined();
      expect(realResponse.status).toEqual(200);
    });
  });

  describe('init', () => {
    it('should fail without init and return 401', async () => {
      const url = `https://projectsapi.zoho.${domain}/restapi/portals/`;
      const method: HttpMethod = 'get';

      await expect((api as unknown as IZoho).sendRequest(method, url)).rejects.toMatchObject({
        status: 401,
      });
    });
  });
});
