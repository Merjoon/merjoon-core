import { ZohoApi } from '../api';
import { IZohoConfig } from '../types';
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

if (!refreshToken || !clientId || !clientSecret) {
  throw new Error('Missing required parameters');
}

describe('Zoho API sendRequest', () => {
  let api: ZohoApi;
  let config: IZohoConfig;

  beforeEach(() => {
    config = {
      refreshToken,
      clientId,
      clientSecret,
      maxSockets: 5,
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
});
