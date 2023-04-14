import { Message } from "discord.js";
import LZString from "lz-string";
import { APIMessage } from "revolt-toolset";
import mapAttachment from "./attachment";
import mapEmbed from "./embed";
import { snowflakeToULID } from "./ulid";
import { mapMarkdown } from "./util";

export default function mapMessage(message: Message): APIMessage {
  return {
    _id: snowflakeToULID(message.id),
    content: mapMarkdown(message.content, message.guild) || null,
    author: snowflakeToULID(message.author.id),
    attachments: message.attachments.map((a) =>
      mapAttachment(a.id, a.url, a.width, a.height, a.size)
    ),
    channel: snowflakeToULID(message.channelId),
    edited: message.editedAt?.toISOString() ?? null,
    embeds: message.embeds.map(mapEmbed), //TODO:
    interactions: null, //TODO:
    masquerade: message.webhookId
      ? { name: message.author.username, avatar: message.author.displayAvatarURL() }
      : null,
    mentions: null, //TODO:
    nonce: LZString.decompress(String(message.nonce)),
    reactions: null, //TODO:
    replies: null, //TODO:
    system: null, //TODO:
  };
}
