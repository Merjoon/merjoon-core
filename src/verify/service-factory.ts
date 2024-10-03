import { IntegrationId } from './types';
import { teamworkService } from './services/teamwork';
import { hiveService } from './services/hive'; // Assuming this is a promise
import { IMerjoonService } from '../common/types';

const servicesMap = {
  [IntegrationId.Teamwork]: teamworkService,
  [IntegrationId.Hive]: hiveService // hiveService is a promise
};

export async function getService(id: IntegrationId): Promise<IMerjoonService> {
  const service = servicesMap[id];

  // If the service is a promise (like hiveService), resolve it.
  if (service instanceof Promise) {
    return await service;
  }

  return service;  // For services like teamworkService, which are not promises
}
