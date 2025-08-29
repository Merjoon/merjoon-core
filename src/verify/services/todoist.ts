import { getTodoistService } from '../../todoist/todoist-service';
import { EntityName, IKahnsAlgorithmGeneric } from '../types';

export const dependencies: IKahnsAlgorithmGeneric<EntityName> = {
  projects: [],
  users: ['projects'],
  tasks: [],
};

export const service = getTodoistService();
