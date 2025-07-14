import { PlaneApi } from './api';
import { PlaneService } from './service';
import { PlaneTransformer } from './transformer';
import { IPlaneConfig } from './types';

export function getPlaneService(): PlaneService {
  const { PLANE_API_KEY, PLANE_WORKSPACE_SLUG } = process.env;

  if (!PLANE_API_KEY || !PLANE_WORKSPACE_SLUG) {
    throw new Error('Missing necessary environment variables');
  }

  const config: IPlaneConfig = {
    apiKey: PLANE_API_KEY,
    workspaceSlug: PLANE_WORKSPACE_SLUG,
    limit: 100, //????
  };

  const api: PlaneApi = new PlaneApi(config);
  const transformer: PlaneTransformer = new PlaneTransformer();
  return new PlaneService(api, transformer);
}
