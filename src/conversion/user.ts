import { User as DiscordUser } from "discord.js";
import { APIUser } from "revolt-toolset";
import { snowflakeToULID } from "./ulid";

export default function mapUser(user: DiscordUser): APIUser {
  return {
    _id: snowflakeToULID(user.id),
  };
}
