import { getTeamworkService } from '../../teamwork/teamwork-service';
import { EntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<EntityName> = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getTeamworkService();
