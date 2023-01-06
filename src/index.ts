import express from "express";
import { APIRoutes } from "revolt-api/dist/routes";
import config from "./config";
import { Logger } from "./logger";

const app = express();
app.use(express.json());

app.listen(config.port, () => {
  Logger.log(`Listening on port ${config.port}.`);
});

type Count<
  Str extends string,
  SubStr extends string,
  Matches extends null[] = []
> = Str extends `${infer _}${SubStr}${infer After}`
  ? Count<After, SubStr, [...Matches, null]>
  : Matches["length"];
type GetRoutes = APIRoutes & { method: "get" };
type PostRoutes = APIRoutes & { method: "post" };
export function GET<
  Path extends GetRoutes["path"],
  Route extends GetRoutes & {
    path: Path;
    parts: Count<Path, "/">;
  }
  //@ts-expect-error - not sure why, but it works so whatever
>(path: Path, callback: (params: Route["params"]) => Promise<Route["response"]>) {
  app.get(path, (req, res) => {
    callback(req.body);
  });
}
