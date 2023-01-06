import { User as DiscordUser } from "discord.js";
import LZString from "lz-string";
import { APIUser } from "revolt-toolset";
import { snowflakeToULID } from "./ulid";

export default function mapUser(user: DiscordUser): APIUser {
  return {
    _id: snowflakeToULID(user.id),
    username: user.tag,
    flags: 0,
    avatar: {
      _id: snowflakeToULID(user.id),
      tag: LZString.compressToEncodedURIComponent(
        user.displayAvatarURL({
          size: 256,
          extension: "png",
        })
      ),
      filename: user.displayAvatarURL().split("/").pop(),
      metadata: {
        type: "Image",
        width: 256,
        height: 256,
      },
      content_type: "png",
      size: 0,
    },
    badges: 0,
    bot: user.bot ? { owner: snowflakeToULID(user.id) } : null,
    online: false, //TODO:
    privileged: false,
    profile: null, //TODO:
    relationship: user.id == user.client.user.id ? "User" : "None",
    status: null, //TODO
  };
}
