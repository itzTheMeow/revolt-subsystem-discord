import {
  ClientboundNotification,
  ServerboundNotification,
} from "revolt-toolset/dist/es6/websocketNotifications";
import WebSocket from "ws";
import { destroyClient, doAuthenticate } from "./auth";
import mapChannel from "./conversion/channel";
import mapServer from "./conversion/server";
import mapUser from "./conversion/user";

export default async function handleConnection(ws: WebSocket, _token: string) {
  function send(packet: ClientboundNotification) {
    ws.send(JSON.stringify(packet));
  }

  const authenticated = await doAuthenticate(_token);
  if (!authenticated) {
    ws.send(`{"type":"NotFound"}`);
    ws.close();
    return;
  }

  ws.on("message", (message: string) => {
    try {
      const packet = <ServerboundNotification>JSON.parse(message);
      switch (packet.type) {
        case "Ping":
          return send({ type: "Pong", data: packet.data });
      }
    } catch {}
  });
  ws.on("close", () => {
    destroyClient(authenticated);
  });

  send({
    type: "Ready",
    users: authenticated.users.cache.map(mapUser),
    servers: authenticated.guilds.cache.map(mapServer),
    channels: authenticated.channels.cache.map(mapChannel).filter((c) => c),
    members: [],
    emojis: [],
  });
}
