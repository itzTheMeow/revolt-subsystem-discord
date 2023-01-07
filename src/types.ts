import { Request } from "express";
import type { APIRoutes } from "revolt-api/dist/routes";

export type Req = Request<any>;
export type Count<
  Str extends string,
  SubStr extends string,
  Matches extends null[] = []
> = Str extends `${infer _}${SubStr}${infer After}`
  ? Count<After, SubStr, [...Matches, null]>
  : Matches["length"];
export type GetRoutes = APIRoutes & { method: "get" };
export type PostRoutes = APIRoutes & { method: "post" };
export type PutRoutes = APIRoutes & { method: "put" };

export type RouteError = { type: "NotFound" };
