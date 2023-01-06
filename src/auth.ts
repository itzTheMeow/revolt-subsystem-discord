import { Client, GatewayIntentBits } from "discord.js";
import { Logger } from "./logger";
import { Req } from "./types";

const ClientMap: { client: Client; token: string }[] = [];

export function getAuthenticated(req: Req) {
  const token = req.header("X-Bot-Token") || req.header("X-Session-Token");
  return ClientMap.find((c) => c.token == token)?.client ?? null;
}

export async function doAuthenticate(token: string) {
  return new Promise<Client | null>(async (res) => {
    const client = new Client({
      intents: <any>Object.keys(GatewayIntentBits),
    });
    client.on("ready", () => {
      res(client);
    });
    try {
      await client.login(token.split(":__")[0]);
    } catch (err) {
      Logger.debug(err);
      return res(null);
    }
    ClientMap.push({
      token,
      client,
    });
  });
}
export async function destroyClient(client: Client) {
  const i = ClientMap.findIndex((c) => c.client == client);
  if (i >= 0) ClientMap.splice(i, 0);
  client.destroy();
}
