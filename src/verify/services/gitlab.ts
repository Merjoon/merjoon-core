import { getGitLabService } from '../../gitlab/gitlab-service';
import { EntityName, IKahnsAlgorithmGeneric } from '../types';

export const dependencies: IKahnsAlgorithmGeneric<EntityName> = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getGitLabService();
