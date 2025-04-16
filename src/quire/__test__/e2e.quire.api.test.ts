import { QuireApi } from '../api';
import { IQuireConfig } from '../types';

const token = process.env.QUIRE_TOKEN;
if (!token) {
  throw new Error('Missing necessary environment variables: QUIRE_TOKEN');
}

describe('Quire API', () => {
  let api: QuireApi;
  let config: IQuireConfig;

  beforeEach(() => {
    config = {
      token: token,
      limit: 10,
    };
    api = new QuireApi(config);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch all projects', async () => {
    const projects = await api.getAllProjects();
    const users = await api.getAllUsers();
    const oid = projects[0].oid;
    const tasks = await api.getAllTasks(oid);
    // eslint-disable-next-line no-console
    console.log(users, tasks);
  });
});
