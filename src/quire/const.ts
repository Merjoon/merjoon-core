import { QuireApiPath } from './types';
export const QUIRE_PATHS = {
  PROJECTS: `${QuireApiPath.Project}/${QuireApiPath.List}`,
  USER: `${QuireApiPath.User}/${QuireApiPath.List}`,
  TASK: (oid: string) => `${QuireApiPath.Task}/${QuireApiPath.List}/${oid}`,
};
