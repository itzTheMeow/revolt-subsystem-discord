import { FormattingPatterns, Guild, MessageMentions } from "discord.js";
import { snowflakeToULID } from "./ulid";

export function mapMarkdown(text?: string, guild?: Guild): string {
  return text
    ?.replace(new RegExp(MessageMentions.UsersPattern, "g"), (_, id) => `<@${snowflakeToULID(id)}>`)
    .replace(
      new RegExp(MessageMentions.ChannelsPattern, "g"),
      (_, id) => `<#${snowflakeToULID(id)}>`
    )
    .replace(
      new RegExp(MessageMentions.RolesPattern, "g"),
      (_, id) => `@${guild?.roles.cache.get(id)?.name || `Role_${id}`}`
    )
    .replace(
      new RegExp(FormattingPatterns.Emoji, "g"),
      (_, __, ___, id) => `:${snowflakeToULID(id)}:`
    );
}
