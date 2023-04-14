import { Client } from "discord.js-selfbot-v13";
import { ulid } from "ulid";
import { GET } from "../..";
import { snowflakeToULID } from "../../conversion/ulid";

GET("/sync/unreads", async (p: { authenticated: Client }) => {
  return p.authenticated.channels.cache.map((c) => ({
    _id: {
      channel: snowflakeToULID(c.id),
      user: snowflakeToULID(p.authenticated.user.id),
    },
    // 1 year
    last_id: ulid(Date.now() + 3.156e10),
    mentions: [],
  }));
});
