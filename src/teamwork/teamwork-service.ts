import { TeamworkApi } from './api';
import { TeamworkTransformer } from './transformer';
import { TeamworkService } from './service';

export function getTeamworkService(): TeamworkService {
  const { TEAMWORK_TOKEN, TEAMWORK_PASSWORD, TEAMWORK_SUBDOMAIN } = process.env;

  if (!TEAMWORK_TOKEN || !TEAMWORK_PASSWORD || !TEAMWORK_SUBDOMAIN) {
    throw new Error('Missing necessary environment variables');
  }

  const config = {
    token: TEAMWORK_TOKEN,
    password: TEAMWORK_PASSWORD,
    subdomain: TEAMWORK_SUBDOMAIN,
  };

  const api: TeamworkApi = new TeamworkApi(config);
  const transformer: TeamworkTransformer = new TeamworkTransformer();
  return new TeamworkService(api, transformer);
}
