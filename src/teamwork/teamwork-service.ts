import { TeamworkApi } from './api';
import { TeamworkTransformer } from './transformer';
import { TeamworkService } from './service';
import { ITeamworkConfig } from './types';

export function getTeamworkService(): TeamworkService {
  const {
    TEAMWORK_TOKEN,
    TEAMWORK_PASSWORD,
    TEAMWORK_SUBDOMAIN,
    TEAMWORK_LIMIT,
    TEAMWORK_MAX_SOCKETS,
  } = process.env;

  if (!TEAMWORK_TOKEN || !TEAMWORK_PASSWORD || !TEAMWORK_SUBDOMAIN) {
    throw new Error('Missing necessary environment variables');
  }

  const config: ITeamworkConfig = {
    token: TEAMWORK_TOKEN,
    password: TEAMWORK_PASSWORD,
    subdomain: TEAMWORK_SUBDOMAIN,
    limit: Number(TEAMWORK_LIMIT),
    maxSockets: Number(TEAMWORK_MAX_SOCKETS) || 10,
  };
  const api: TeamworkApi = new TeamworkApi(config);
  const transformer: TeamworkTransformer = new TeamworkTransformer();
  return new TeamworkService(api, transformer);
}
