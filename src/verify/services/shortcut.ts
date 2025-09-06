import { getShortcutService } from '../../shortcut/shortcut-service';
import { EntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<EntityName> = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getShortcutService();
