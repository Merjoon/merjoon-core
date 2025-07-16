import { getShortcutService } from '../../shortcut/shortcut-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: [],
  },
};

export const service = getShortcutService();
