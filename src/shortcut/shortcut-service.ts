import { ShortcutApi } from './api';
import { ShortcutService } from './service';
import { ShortcutTransformer } from './transformer';
import { IShortcutConfig } from './types';

export function getShortcutService(): ShortcutService {
  const { SHORTCUT_TOKEN, SHORTCUT_LIMIT, SHORTCUT_MAX_SOCKETS } = process.env;

  if (!SHORTCUT_TOKEN) {
    throw new Error('Missing necessary environment variables');
  }

  const config: IShortcutConfig = {
    token: SHORTCUT_TOKEN,
    limit: Number(SHORTCUT_LIMIT),
    maxSockets: Number(SHORTCUT_MAX_SOCKETS) || 10,
  };

  const api: ShortcutApi = new ShortcutApi(config);
  const transformer: ShortcutTransformer = new ShortcutTransformer();
  return new ShortcutService(api, transformer);
}
