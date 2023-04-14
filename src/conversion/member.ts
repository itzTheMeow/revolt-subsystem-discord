import { GuildMember } from "discord.js-selfbot-v13";
import { APIMember } from "revolt-toolset";
import mapAttachment from "./attachment";
import { snowflakeToULID } from "./ulid";

export default function mapMember(member: GuildMember): APIMember {
  return {
    _id: {
      server: snowflakeToULID(member.guild.id),
      user: snowflakeToULID(member.id),
    },
    joined_at: member.joinedAt.toISOString(),
    nickname: member.nickname ?? null,
    avatar: mapAttachment(member.id, member.avatarURL({ size: 256 })),
    roles: member.roles.cache
      .filter((r) => r.id !== member.guild.id)
      .map((r) => snowflakeToULID(r.id)),
    timeout: member.communicationDisabledUntil
      ? member.communicationDisabledUntil.toISOString()
      : null,
  };
}
