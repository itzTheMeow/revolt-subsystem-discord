import { Client, Guild } from "discord.js-selfbot-v13";
import { GET } from "../..";
import { snowflakeToULID, ulidToSnowflake } from "../../conversion/ulid";

GET("-/users/{target}/mutual", async (params: { authenticated: Client; target: string }) => {
  const user = await params.authenticated.users.fetch(ulidToSnowflake(params.target), {
    force: true,
  });
  if (!user) return { users: [], servers: [] };
  return {
    users: (await user.mutualFriends).map((u) => snowflakeToULID(u.id)),
    servers: user.mutualGuilds.map((g) => snowflakeToULID((<Guild>g).id)),
  };
});
