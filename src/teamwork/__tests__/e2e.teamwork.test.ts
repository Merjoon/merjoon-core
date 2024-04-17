import { TeamworkService } from '../service';
import { TeamworkApi } from '../api';
import { ITeamworkConfig } from '../types';
import { TeamworkTransformer } from '../transformer';

describe('e2e TeamWork', () => {

  let service: TeamworkService

  beforeEach(() => {
    const config: ITeamworkConfig = {
      token: process.env.TEAMWORK_TOKEN!,
      password: process.env.TEAMWORK_PASSWORD!,
      subdomain: process.env.TEAMWORK_SUBDOMAIN!,
    }
    const api = new TeamworkApi(config);
    const transformer = new TeamworkTransformer()
    service = new TeamworkService(api, transformer);
  })

  it('getUsers', async () => {
    const [user] = await service.getUsers();
  })
})
