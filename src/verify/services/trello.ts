import { getTrelloService } from '../../trello/trello-service';
import { EntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<EntityName> = {
  users: [],
  projects: [],
  tasks: ['projects'],
};

export const service = getTrelloService();
