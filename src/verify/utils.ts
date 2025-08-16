import fs from 'node:fs/promises';
import { EntityName, IntegrationId, EntityDependencyMap, ENTITY_NAME_TO_METHOD } from './types';
import { IMerjoonEntity, IMerjoonService } from '../common/types';

export class MerjoonExecutor {
  constructor(
    private service: IMerjoonService,
    private integrationId: IntegrationId,
  ) {}

  public async saveEntities(entity: EntityName, payload: IMerjoonEntity[]) {
    const folder = `.transformed/${this.integrationId}`;
    await fs.mkdir(folder, {
      recursive: true,
    });

    await fs.writeFile(`${folder}/${entity}.json`, JSON.stringify(payload, null, 2));
  }

  public initGraph(dependencies: EntityDependencyMap) {
    const graph: Record<EntityName, EntityName[]> = {};
    const inLevel: Record<EntityName, number> = {};

    for (const node in dependencies) {
      graph[node] = [];
      inLevel[node] = 0;
    }

    return {
      graph,
      inLevel,
    };
  }

  public buildGraph(
    dependencies: EntityDependencyMap,
    graph: Record<EntityName, EntityName[]>,
    inLevel: Record<EntityName, number>,
  ) {
    for (const node in dependencies) {
      for (const dep of dependencies[node] ?? []) {
        graph[dep].push(node);
        inLevel[node]++;
      }
    }
  }

  public topologicalSort(
    dependencies: EntityDependencyMap,
    graph: Record<EntityName, EntityName[]>,
    inLevel: Record<EntityName, number>,
  ): EntityName[][] {
    let queue = Object.keys(inLevel).filter((n) => inLevel[n] === 0);
    const stages: EntityName[][] = [];

    while (queue.length) {
      stages.push(queue);
      const nextQueue: EntityName[] = [];

      for (const node of queue) {
        for (const neighbor of graph[node]) {
          inLevel[neighbor]--;
          if (inLevel[neighbor] === 0) {
            nextQueue.push(neighbor);
          }
        }
      }

      queue = nextQueue;
    }

    if (stages.flat().length !== Object.keys(dependencies).length) {
      throw new Error('Cycle detected in dependencies');
    }

    return stages;
  }

  public getExecutionOrder(dependencies: EntityDependencyMap): EntityName[][] {
    const { graph, inLevel } = this.initGraph(dependencies);
    this.buildGraph(dependencies, graph, inLevel);
    return this.topologicalSort(dependencies, graph, inLevel);
  }

  private async *executeOrder(dependencies: EntityDependencyMap) {
    const order = this.getExecutionOrder(dependencies);

    for (const batch of order) {
      const results = await Promise.all(
        batch.map((entity: EntityName) => {
          const method = ENTITY_NAME_TO_METHOD[entity];
          return this.service[method]();
        }),
      );

      yield batch.map((entity, i) => ({
        entity,
        data: results[i],
      }));
    }
  }

  public async fetchEntitiesInOrder(dependencies: EntityDependencyMap) {
    for await (const batch of this.executeOrder(dependencies)) {
      for (const { entity, data } of batch) {
        await this.saveEntities(entity, data);
      }
    }
  }
}
