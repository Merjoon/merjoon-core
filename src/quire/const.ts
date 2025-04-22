import { QuireApiPath } from './types';

export const QUIRE_PATHS = {
  PROJECTS: `${QuireApiPath.Project}/list`,
  USER: `${QuireApiPath.User}/list`,
  TASK: (oid: string) => `${QuireApiPath.Task}/list/${oid}`,
};
