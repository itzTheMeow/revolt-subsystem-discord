import { POST } from "../../..";
import { snowflakeToULID } from "../../../conversion/ulid";

POST("/sync/settings/fetch", async (params) => {
  const syncSettings: Record<string, Record<string, any> | any[]> = {
    ordering: {
      servers: params.authenticated.settings.guildFolder.cache
        .map((f) => f.guild_ids)
        .flat(1)
        .map(snowflakeToULID),
    },
  };

  if (params.keys?.length) {
    Object.keys(syncSettings).forEach((k) => !params.keys.includes(k) && delete syncSettings[k]);
  }

  return Object.entries(syncSettings).reduce(
    (settings, e) => ({ ...settings, [e[0]]: [Date.now(), JSON.stringify(e[1])] }),
    {}
  );
});
