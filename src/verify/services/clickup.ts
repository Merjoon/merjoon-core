import { getClickUpService } from '../../clickup/clickup-service';
import { EntityName, IKahnsAlgorithmGeneric } from '../types';

export const dependencies: IKahnsAlgorithmGeneric<EntityName> = {
  users: [],
  projects: ['users'],
  tasks: ['projects'],
};

export const service = getClickUpService();
