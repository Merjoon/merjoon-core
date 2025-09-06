import { PlaneApi } from './api';
import { PlaneService } from './service';
import { PlaneTransformer } from './transformer';
import { IPlaneConfig } from './types';

export function getPlaneService(): PlaneService {
  const { PLANE_API_KEY, PLANE_WORKSPACE_SLUG, PLANE_LIMIT, PLANE_MAX_SOCKETS } = process.env;

  if (!PLANE_API_KEY || !PLANE_WORKSPACE_SLUG) {
    throw new Error('Missing necessary environment variables');
  }

  const config: IPlaneConfig = {
    apiKey: PLANE_API_KEY,
    workspaceSlug: PLANE_WORKSPACE_SLUG,
    maxSockets: Number(PLANE_MAX_SOCKETS) || 10,
    limit: Number(PLANE_LIMIT),
  };

  const api: PlaneApi = new PlaneApi(config);
  const transformer: PlaneTransformer = new PlaneTransformer();
  return new PlaneService(api, transformer);
}
