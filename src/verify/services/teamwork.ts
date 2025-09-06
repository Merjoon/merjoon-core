import { getTeamworkService } from '../../teamwork/teamwork-service';
import { BaseEntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<BaseEntityName> = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getTeamworkService();
