import { Client } from "discord.js";
import { GET } from "../..";
import mapMember from "../../conversion/member";
import { snowflakeToULID, ulidToSnowflake } from "../../conversion/ulid";
import mapUser from "../../conversion/user";

GET("-/servers/{target}/members", async (params: { authenticated: Client; target: string }) => {
  try {
    const server = params.authenticated.guilds.cache.get(ulidToSnowflake(params.target));
    const members = await server.members.fetch({ withPresences: true });
    return {
      users: members.map((m) => mapUser(m.user)),
      members: members.map(mapMember),
    };
  } catch (err) {
    return { users: [], members: [] };
  }
});
GET(
  "-/servers/{target}/members/{member}",
  async (params: { authenticated: Client; target: string; member: string }) => {
    try {
      const server = params.authenticated.guilds.cache.get(ulidToSnowflake(params.target));
      const members = await server.members.fetch({
        withPresences: true,
        user: ulidToSnowflake(params.member),
      });
      return mapMember(members[0]);
    } catch {
      try {
        const server = params.authenticated.guilds.cache.get(ulidToSnowflake(params.target));
        const hook = (await server.fetchWebhooks()).find(
          (w) => w.id == ulidToSnowflake(params.member)
        );
        return hook
          ? {
              _id: { server: snowflakeToULID(server.id), user: snowflakeToULID(hook.id) },
              joined_at: hook.createdAt.toISOString(),
            }
          : { type: "NotFound" };
      } catch {
        return { type: "NotFound" };
      }
    }
  }
);
