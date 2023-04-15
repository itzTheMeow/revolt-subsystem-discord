import { CategoryChannel, Guild } from "discord.js-selfbot-v13";
import { APIServer, RevoltServerFlags, ServerFlags } from "revolt-toolset";
import mapAttachment from "./attachment";
import { discPerm2Revolt } from "./permissions";
import { snowflakeToULID } from "./ulid";

export default function mapServer(server: Guild): APIServer {
  return {
    _id: snowflakeToULID(server.id),
    name: server.name,
    banner: mapAttachment(server.id, server.bannerURL({ size: 256 })),
    channels: server.channels.cache
      .filter((c) => c.type !== "GUILD_CATEGORY" && !c.type.includes("THREAD") && c.viewable)
      .map((c) => snowflakeToULID(c.id)),
    categories: server.channels.cache
      .filter((c) => c.type == "GUILD_CATEGORY" && c.viewable)
      .sorted((a: CategoryChannel, b: CategoryChannel) => a.position - b.position)
      .map((c: CategoryChannel) => ({
        id: snowflakeToULID(c.id),
        title: c.name,
        channels: c.children
          .filter((c) => c.viewable)
          .sorted(
            (a, b) =>
              // pushes voice channels to the bottom
              a.rawPosition +
              (a.type.includes("VOICE") ? server.channels.cache.size ** 2 : 0) -
              (b.rawPosition + (b.type.includes("VOICE") ? server.channels.cache.size ** 2 : 0))
          )
          .map((c) => snowflakeToULID(c.id)),
      })),
    default_permissions: discPerm2Revolt(server.roles.cache.get(server.id)?.permissions).bits,
    description: server.description,
    discoverable: server.features.includes("DISCOVERABLE"),
    flags: (() => {
      const f = new ServerFlags(0);
      if (server.features.includes("VERIFIED")) f.add(RevoltServerFlags.Verified);
      return f;
    })().bits,
    icon: mapAttachment(server.id, server.iconURL({ size: 256 })),
    nsfw: false,
    owner: snowflakeToULID(server.ownerId),
    roles: server.roles.cache
      .filter((r) => r.id !== server.id)
      .reduce(
        (list, role) => ({
          ...list,
          [snowflakeToULID(role.id)]: {
            name: role.name,
            permissions: {
              a: discPerm2Revolt(role.permissions).bits,
              d: 0,
            },
            colour: role.color ? role.hexColor : null,
            hoist: role.hoist,
            rank: role.guild.roles.cache.size - role.position,
          },
        }),
        {}
      ),
    system_messages: null,
  };
}
