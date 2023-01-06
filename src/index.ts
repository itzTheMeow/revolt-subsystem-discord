import express from "express";
import { createServer } from "http";
import ws from "ws";
import config from "./config";
import { Logger } from "./logger";
import initRoutes from "./routes";
import { Count, GetRoutes, Req } from "./types";
import handleConnection from "./ws";

const app = express();
app.use(express.json());

export function GET<
  Path extends GetRoutes["path"],
  Route extends GetRoutes & {
    path: Path;
    parts: Count<Path, "/">;
  }
  //@ts-expect-error - not sure why, but it works so whatever
>(path: Path, callback: (params: Route["params"], req: Req) => Promise<Route["response"]>) {
  app.get(path, async (req, res) => {
    res.json(await callback(req.body, req));
  });
}

initRoutes();

const server = createServer(app);

const sockets = new ws.Server({
  server,
});
sockets.on("connection", (ws) => {
  Logger.debug(`Received connection.`);
  ws.once("message", (d) => {
    try {
      const packet: { type: "Authenticate"; token: string } = JSON.parse(d.toString());
      if (packet.type == "Authenticate" && typeof packet.token == "string")
        handleConnection(ws, packet.token);
      else ws.close();
    } catch {
      ws.close();
    }
  });
});

server.listen(config.port, () => {
  Logger.log(`Listening on port ${config.port}.`);
});
