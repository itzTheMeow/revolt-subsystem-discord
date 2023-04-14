import axios from "axios";
import cors from "cors";
import { Client } from "discord.js";
import express, { Request, Response } from "express";
import { createServer } from "http";
import LZString from "lz-string";
import nocache from "nocache";
import ws from "ws";
import { getAuthenticated } from "./auth";
import config from "./config";
import { ulidToSnowflake } from "./conversion/ulid";
import { Logger } from "./logger";
import initRoutes from "./routes";
import { Count, GetRoutes, PostRoutes, PutRoutes, Req, RouteError } from "./types";
import handleConnection from "./ws";

const app = express();
app.use(cors());
app.use(express.json());

function doPath(path: string) {
  return path.replace(/^-/, "").replace(/{(\S+?)}/g, ":$1");
}

async function respond(req: Request, res: Response, callback: any, data: Record<string, any>) {
  const d = await callback(data, req);
  res.status(d.type == "NotFound" ? 404 : 200).json(d);
}

export function GET<
  Path extends GetRoutes["path"],
  Route extends GetRoutes & {
    path: Path;
    parts: Count<Path, "/">;
  }
>(
  path: Path,
  callback: (
    //@ts-expect-error - not sure why, but it works so whatever
    params: Route["params"] & { authenticated: Client },
    req: Req
    //@ts-expect-error
  ) => Promise<Route["response"] | RouteError>
) {
  app.get(doPath(path), nocache(), async (req, res) => {
    const authenticated = getAuthenticated(req);
    if (!authenticated && path !== "/" && path !== "/onboard/hello")
      return res.status(401).json({ err: "Unauthorized" });
    respond(req, res, callback, { ...req.query, ...req.params, authenticated });
  });
}
export function POST<
  Path extends PostRoutes["path"],
  Route extends PostRoutes & {
    path: Path;
    parts: Count<Path, "/">;
  }
>(
  path: Path,
  callback: (
    //@ts-expect-error - not sure why, but it works so whatever
    params: Route["params"] & { authenticated: Client },
    req: Req
    //@ts-expect-error
  ) => Promise<Route["response"] | RouteError>
) {
  app.post(doPath(path), nocache(), async (req, res) => {
    const authenticated = getAuthenticated(req);
    if (!authenticated && path !== "/auth/session/login")
      return res.status(401).json({ err: "Unauthorized" });
    respond(req, res, callback, { ...req.query, ...req.params, ...req.body, authenticated });
  });
}
export function PUT<
  Path extends PutRoutes["path"],
  Route extends PutRoutes & {
    path: Path;
    parts: Count<Path, "/">;
  }
>(
  path: Path,
  callback: (
    //@ts-expect-error - not sure why, but it works so whatever
    params: Route["params"] & { authenticated: Client },
    req: Req
    //@ts-expect-error
  ) => Promise<Route["response"] | RouteError>
) {
  app.put(doPath(path), nocache(), async (req, res) => {
    const authenticated = getAuthenticated(req);
    if (!authenticated) return res.status(401).json({ err: "Unauthorized" });
    respond(req, res, callback, { ...req.query, ...req.params, ...req.body, authenticated });
  });
}

app.get("/attachments/:bucket/:id/:filename?", async (req, res) => {
  try {
    const url =
      req.params.bucket == "emojis"
        ? `https://cdn.discordapp.com/emojis/${ulidToSnowflake(req.params.id)}.gif`
        : LZString.decompressFromEncodedURIComponent(req.params.bucket);
    if (!url) return res.status(404).send("NOT OK");
    const data = await (async () => {
      try {
        return await axios.get(url, {
          responseType: "arraybuffer",
        });
      } catch {
        return await axios.get(url.replace(/\.gif$/, ".png"), {
          responseType: "arraybuffer",
        });
      }
    })();
    res.contentType(data.headers["content-type"]).status(200).end(data.data);
  } catch {
    res.status(404).send("NOT OK");
  }
});

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
