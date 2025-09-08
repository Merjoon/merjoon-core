import { getGitLabService } from '../../gitlab/gitlab-service';
import { EntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<EntityName> = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getGitLabService();
