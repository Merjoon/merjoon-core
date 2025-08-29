import { getShortcutService } from '../../shortcut/shortcut-service';
import { EntityName, IKahnsAlgorithmGeneric } from '../types';

export const dependencies: IKahnsAlgorithmGeneric<EntityName> = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getShortcutService();
