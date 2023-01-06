import { User as DiscordUser } from "discord.js";
import { APIUser } from "revolt-toolset";
import mapAttachment from "./attachment";
import { snowflakeToULID } from "./ulid";

export default function mapUser(user: DiscordUser): APIUser {
  return {
    _id: snowflakeToULID(user.id),
    username: user.tag,
    flags: 0,
    avatar: mapAttachment(user.id, user.displayAvatarURL({ size: 256, extension: "png" })),
    badges: 0,
    bot: user.bot ? { owner: snowflakeToULID(user.id) } : null,
    online: false, //TODO:
    privileged: false,
    profile: null, //TODO:
    relationship: user.id == user.client.user.id ? "User" : "None",
    status: null, //TODO
  };
}
