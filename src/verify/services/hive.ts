import { HiveTransformer } from '../../hive/transformer';
import { HiveService } from '../../hive/service';
import { IHiveConfig } from '../../hive/types';
import { HiveApi } from '../../hive/api';

const {
    HIVE_API_KEY,
    HIVE_USER_ID,
    HIVE_WORKSPACE_ID,
} = process.env;

const config: IHiveConfig = {
    api_key: HIVE_API_KEY!,
    user_id: HIVE_USER_ID!,
    workspace_id: HIVE_WORKSPACE_ID!,
};

const api: HiveApi = new HiveApi(config);
const transformer: HiveTransformer = new HiveTransformer();
export const hiveService = new HiveService(api, transformer);
