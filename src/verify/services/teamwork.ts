import { ITeamworkConfig } from '../../teamwork/types';
import { TeamworkApi } from '../../teamwork/api';
import { TeamworkTransformer } from '../../teamwork/transformer';
import { TeamworkService } from '../../teamwork/service';

const {
  TEAMWORK_TOKEN,
  TEAMWORK_PASSWORD,
  TEAMWORK_SUBDOMAIN,
} = process.env;

const config: ITeamworkConfig = {
  token: TEAMWORK_TOKEN!,
  password: TEAMWORK_PASSWORD!,
  subdomain: TEAMWORK_SUBDOMAIN!,
};

const api: TeamworkApi = new TeamworkApi(config);
const transformer: TeamworkTransformer = new TeamworkTransformer();
export const teamworkService = new TeamworkService(api, transformer);
