import { ITeamworkConfig } from '../../teamwork/types';
import { TeamworkApi } from '../../teamwork/api';
import { TeamworkTransformer } from '../../teamwork/transformer';
import { TeamworkService } from '../../teamwork/service';
import { getConfig} from "../../teamwork/config";

const config: ITeamworkConfig = getConfig();
const api: TeamworkApi = new TeamworkApi(config);
const transformer: TeamworkTransformer = new TeamworkTransformer();
export const teamworkService = new TeamworkService(api, transformer);
