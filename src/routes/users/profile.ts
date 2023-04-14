import { Client } from "discord.js-selfbot-v13";
import { GET } from "../..";
import mapAttachment from "../../conversion/attachment";
import { ulidToSnowflake } from "../../conversion/ulid";
import { mapMarkdown } from "../../conversion/util";

GET("-/users/{target}/profile", async (params: { authenticated: Client; target: string }) => {
  const user = await params.authenticated.users.fetch(ulidToSnowflake(params.target), {
    force: true,
  });
  if (!user) return { background: null, content: null };
  return {
    background: user.banner ? mapAttachment(user.id, user.bannerURL({ size: 256 })) : null,
    content: mapMarkdown(user.bio) ?? null,
  };
});
