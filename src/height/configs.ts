import { HeightApi } from "./api";
import { HeightService } from "./service";
import { HeightTransformer } from "./transformer";
import { IHeightConfig } from "./types";

export const getHeightConfig = () => {
  const { HEIGHT_SECRET } = process.env;

  if (!HEIGHT_SECRET) {
    throw new Error("Missing necessary environment variables");
  }

  const config: IHeightConfig = {
    secret: HEIGHT_SECRET,
  };

  const api: HeightApi = new HeightApi(config);
  const transformer = new HeightTransformer();

  return new HeightService(api, transformer);
};
