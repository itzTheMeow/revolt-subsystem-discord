import express from "express";
import config from "./config";
import { Logger } from "./logger";
import initRoutes from "./routes";
import { Count, GetRoutes, Req } from "./types";

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

app.listen(config.port, () => {
  Logger.log(`Listening on port ${config.port}.`);
});
