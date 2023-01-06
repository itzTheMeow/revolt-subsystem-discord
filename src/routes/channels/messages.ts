import { GET } from "../..";
import mapMember from "../../conversion/member";
import mapMessage from "../../conversion/message";
import { ulidToSnowflake } from "../../conversion/ulid";
import mapUser from "../../conversion/user";
import { Logger } from "../../logger";

GET("-/channels/{target}/messages", async (params) => {
  try {
    const channel = params.authenticated.channels.cache.get(ulidToSnowflake((<any>params).target));
    if (!channel || !channel.isTextBased()) return [];
    const messages = [
      ...(
        await channel.messages.fetch({
          limit: params.limit || 100,
          before: params.before ? ulidToSnowflake(params.before) : undefined,
          after: params.after ? ulidToSnowflake(params.after) : undefined,
          around: params.nearby ? ulidToSnowflake(params.nearby) : undefined,
        })
      ).values(),
    ];
    if (params.include_users) {
      return {
        users: [...new Set(messages.map((m) => m.author.id))]
          .map((i) => channel.client.users.cache.get(i))
          .filter((u) => u)
          .map(mapUser),
        members: !channel.isDMBased()
          ? [...new Set(messages.map((m) => m.member.id))]
              .map((i) => channel.guild.members.cache.get(i))
              .filter((m) => m)
              .map(mapMember)
          : [],
        messages: messages.map(mapMessage),
      };
    } else return messages.map(mapMessage);
  } catch (err) {
    Logger.debug(err);
    return [];
  }
});
