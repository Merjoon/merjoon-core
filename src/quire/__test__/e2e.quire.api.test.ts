import { QuireApi } from '../api';
import { IQuireConfig } from '../types';

const clientId = process.env.QUIRE_CLIENT_ID;
const clientSecret = process.env.QUIRE_CLIENT_SECRET;
const refreshToken = process.env.QUIRE_REFRESH;
if (!refreshToken || !clientId || !clientSecret) {
  throw new Error('Missing required parameters');
}

describe('Quire API', () => {
  let api: QuireApi;
  let config: IQuireConfig;

  beforeEach(async () => {
    config = {
      token: 'invalid_token',
      refreshToken: refreshToken,
      clientId: clientId,
      clientSecret: clientSecret,
      limit: 10,
    };
    api = new QuireApi(config);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch all projects', async () => {
    await api.getAllProjects();
    await api.getAllUsers();
    await api.getAllTasks((await api.getAllProjects())[0].oid);
  });
});
