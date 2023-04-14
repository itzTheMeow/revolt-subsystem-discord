import { GuildEmoji } from "discord.js-selfbot-v13";
import { APIEmoji } from "revolt-toolset";
import { snowflakeToULID } from "./ulid";

export default function mapEmoji(emoji: GuildEmoji): APIEmoji {
  return {
    _id: snowflakeToULID(emoji.id),
    name: emoji.name,
    animated: emoji.animated,
    creator_id: snowflakeToULID(emoji.author?.id || emoji.client.user.id),
    nsfw: false,
    parent: { type: "Server", id: snowflakeToULID(emoji.guild.id) },
  };
}
