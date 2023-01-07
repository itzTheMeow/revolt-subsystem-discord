import LZString from "lz-string";
import { GET, POST } from "../..";
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
          .map((i) => messages.find((m) => m.author.id == i))
          .filter((m) => m)
          .map((m) => mapUser(m.author)),
        members: !channel.isDMBased()
          ? [...new Set(messages.map((m) => m.member?.id))]
              .map((i) => channel.guild.members.cache.get(i || ""))
              .filter((m) => m)
              .map(mapMember)
          : [],
        messages: messages.map(mapMessage),
      };
    } else return messages.map(mapMessage);
  } catch (err) {
    Logger.debug(err + "\n" + err.stack);
    return [];
  }
});

POST("-/channels/{target}/messages", async (params) => {
  try {
    const channel = params.authenticated.channels.cache.get(ulidToSnowflake((<any>params).target));
    if (!channel || !channel.isTextBased()) return { err: "Invalid" };
    const message = await channel.send({
      content: params.content,
      reply: params.replies?.length
        ? {
            messageReference: params.replies[0].id,
            failIfNotExists: false,
          }
        : undefined,
      nonce: LZString.compress(params.nonce), // max nonce is 25 long, ULIDs are 26
    });
    return mapMessage(message);
  } catch (err) {
    Logger.debug(err);
    return <any>{ err: "Invalid" };
  }
});
