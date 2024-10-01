import {ITeamworkConfig} from "./types";

export function getConfig(): ITeamworkConfig {
    const {
        TEAMWORK_TOKEN,
        TEAMWORK_PASSWORD,
        TEAMWORK_SUBDOMAIN,
    } = process.env;

    if (!TEAMWORK_TOKEN || !TEAMWORK_PASSWORD || !TEAMWORK_SUBDOMAIN) {
        throw new Error('Missing necessary environment variables');
    }

    return {
        token: TEAMWORK_TOKEN,
        password: TEAMWORK_PASSWORD,
        subdomain: TEAMWORK_SUBDOMAIN,
    };
}