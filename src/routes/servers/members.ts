import { GET } from "../..";
import mapMember from "../../conversion/member";
import { ulidToSnowflake } from "../../conversion/ulid";
import mapUser from "../../conversion/user";

GET("-/servers/{target}/members", async (params) => {
  try {
    const server = params.authenticated.guilds.cache.get(ulidToSnowflake((<any>params).target));
    const members = await server.members.fetch({ withPresences: true });
    return {
      users: members.map((m) => mapUser(m.user)),
      members: members.map(mapMember),
    };
  } catch (err) {
    return { users: [], members: [] };
  }
});
