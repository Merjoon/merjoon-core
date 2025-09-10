import { getShortcutService } from '../../shortcut/shortcut-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getShortcutService();
