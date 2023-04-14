import { AnyChannel, BaseGuildTextChannel } from "discord.js-selfbot-v13";
import { APIChannel, Permissions } from "revolt-toolset";
import { discPerm2Revolt } from "./permissions";
import { snowflakeToULID } from "./ulid";
import { mapMarkdown } from "./util";

export default function mapChannel(channel: AnyChannel): APIChannel | null {
  const _id = snowflakeToULID(channel.id);
  if (channel instanceof BaseGuildTextChannel)
    return channel.viewable
      ? {
          _id,
          channel_type: "TextChannel",
          name: channel.name,
          description: mapMarkdown(channel.topic),
          default_permissions:
            channel.permissionOverwrites.cache
              .filter((o) => o.id == channel.guildId)
              .map((o) => ({
                a: discPerm2Revolt(o.allow).bits,
                d: discPerm2Revolt(o.deny).bits,
              }))[0] ?? null,
          icon: null,
          last_message_id: snowflakeToULID(channel.lastMessageId),
          nsfw: channel.nsfw,
          role_permissions: {
            ...channel.permissionOverwrites.cache
              .filter((o) => o.type == "role" && o.id !== channel.guildId)
              .reduce(
                (v, o) => ({
                  ...v,
                  [snowflakeToULID(o.id)]: {
                    a: discPerm2Revolt(o.allow).bits,
                    d: discPerm2Revolt(o.deny).bits,
                  },
                }),
                {}
              ),
            ...channel.guild.roles.cache
              .filter((r) => r.permissions.has("ADMINISTRATOR"))
              .reduce(
                (v, o) => ({
                  ...v,
                  [snowflakeToULID(o.id)]: {
                    a: Permissions.GrantAllSafe,
                    d: 0,
                  },
                }),
                {}
              ),
          },
          server: snowflakeToULID(channel.guildId),
        }
      : null;
  return null;
}

/* 
server: string;
            name: string;
            description?: string | null;
            icon?: components["schemas"]["File"] | null;
            last_message_id?: string | null;
            default_permissions?: components["schemas"]["OverrideField"] | null;
            role_permissions?: {
                [key: string]: components["schemas"]["OverrideField"];
            };
            nsfw?: boolean;
*/
