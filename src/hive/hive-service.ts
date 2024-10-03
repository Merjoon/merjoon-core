import {HiveApi} from "./api";
import {HiveTransformer} from "./transformer";
import {HiveService} from "./service";

export async function getHiveService(): Promise<HiveService> {
    const {
        HIVE_API_KEY,
        HIVE_USER_ID,
    } = process.env;

    if (!HIVE_API_KEY || !HIVE_USER_ID) {
        throw new Error('Missing necessary environment variables');
    }

    const config = {
        apiKey: HIVE_API_KEY,
        userId: HIVE_USER_ID,
    };

    const api: HiveApi = new HiveApi(config);
    await api.init();
    const transformer: HiveTransformer = new HiveTransformer();
    return new HiveService(api, transformer);
}
