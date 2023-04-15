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
      // copied from FormattingPatterns.Emoji but modified to accept a 1-character emoji name
      /<(?<animated>a)?:(?<name>\w{1,32}):(?<id>\d{17,20})>/g,
      (_, __, ___, id) => `:${snowflakeToULID(id)}:`
    )
    .replace(new RegExp(FormattingPatterns.SlashCommand, "gu"), (_, name) => `\`/${name}\``);
}
