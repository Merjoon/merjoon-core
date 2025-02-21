import fs from 'node:fs/promises';

import {
  EntityName, IntegrationId
} from './types';
import {
  IMerjoonEntity
} from '../common/types';

export async function saveEntities(serviceName: IntegrationId, entityName: EntityName, payload: IMerjoonEntity[]) {
  const folder = `.transformed/${serviceName}`;
  await fs.mkdir(folder, {
    recursive: true,
  });
  await fs.writeFile(`${folder}/${entityName}.json`, JSON.stringify(payload, null, 2));
}
