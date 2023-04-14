import { FormattingPatterns } from "discord-api-types/globals";
import { Guild, MessageMentions } from "discord.js-selfbot-v13";
import { snowflakeToULID } from "./ulid";

export function mapMarkdown(text?: string, guild?: Guild): string {
  return text
    ?.replace(
      new RegExp(MessageMentions.USERS_PATTERN, "g"),
      (_, id) => `<@${snowflakeToULID(id)}>`
    )
    .replace(
      new RegExp(MessageMentions.CHANNELS_PATTERN, "g"),
      (_, id) => `<#${snowflakeToULID(id)}>`
    )
    .replace(
      new RegExp(MessageMentions.ROLES_PATTERN, "g"),
      (_, id) => `@${guild?.roles.cache.get(id)?.name || `Role_${id}`}`
    )
    .replace(
      new RegExp(FormattingPatterns.Emoji, "g"),
      (_, __, ___, id) => `:${snowflakeToULID(id)}:`
    )
    .replace(new RegExp(FormattingPatterns.SlashCommand, "gu"), (_, name) => `\`/${name}\``);
}
