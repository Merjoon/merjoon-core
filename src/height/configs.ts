import { HeightApi } from "./api";
import { HeightService } from "./service";
import { HeightTransformer } from "./transformer";
import { IHeightConfig } from "./types";

export const getHeightConfig = () => {
  const { HEIGHT_API_KEY } = process.env;

  if (!HEIGHT_API_KEY) {
    throw new Error("Missing necessary environment variables");
  }

  const config: IHeightConfig = {
    apiKey: HEIGHT_API_KEY,
  };

  const api: HeightApi = new HeightApi(config);
  const transformer = new HeightTransformer();

  return new HeightService(api, transformer);
};
