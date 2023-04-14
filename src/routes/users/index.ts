import { Client } from "discord.js-selfbot-v13";
import { GET } from "../..";
import { ulidToSnowflake } from "../../conversion/ulid";
import mapUser from "../../conversion/user";

GET("-/users/{target}", async (params: { authenticated: Client; target: string }) => {
  const user = await params.authenticated.users.fetch(ulidToSnowflake(params.target));
  if (!user) return { type: "NotFound" };
  return mapUser(user);
});
