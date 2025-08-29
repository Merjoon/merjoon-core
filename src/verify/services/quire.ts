import { getQuireService } from '../../quire/quire-service';
import { EntityName, IKahnsAlgorithmGeneric } from '../types';

export const dependencies: IKahnsAlgorithmGeneric<EntityName> = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getQuireService();
