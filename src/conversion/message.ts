import { Message } from "discord.js";
import { APIMessage } from "revolt-toolset";
import { snowflakeToULID } from "./ulid";

export default function mapMessage(message: Message): APIMessage {
  return {
    _id: snowflakeToULID(message.id),
    content: message.content || null,
    author: snowflakeToULID(message.author.id),
    attachments: null, //TODO:
    channel: snowflakeToULID(message.channelId),
    edited: message.editedAt?.toISOString() ?? null,
    embeds: null, //TODO:
    interactions: null, //TODO:
    masquerade: message.webhookId
      ? { name: message.author.username, avatar: message.author.displayAvatarURL() }
      : null,
    mentions: null, //TODO:
    reactions: null, //TODO:
    replies: null, //TODO:
    system: null, //TODO:
  };
}
