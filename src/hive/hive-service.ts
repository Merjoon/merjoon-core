import {HiveApi} from "./api";
import {HiveTransformer} from "./transformer";
import {HiveService} from "./service";

export function getHiveService(): HiveService {
    const {
        HIVE_API_KEY,
        HIVE_USER_ID,
        HIVE_WORKSPACE_ID,
    } = process.env;

    if (!HIVE_API_KEY || !HIVE_USER_ID || !HIVE_WORKSPACE_ID) {
        throw new Error('Missing necessary environment variables');
    }

    const config = {
        api_key: HIVE_API_KEY,
        user_id: HIVE_USER_ID,
        workspace_id: HIVE_WORKSPACE_ID,
    };

    const api: HiveApi = new HiveApi(config);
    const transformer: HiveTransformer = new HiveTransformer();
    return new HiveService(api, transformer);
}
