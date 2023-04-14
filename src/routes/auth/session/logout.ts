import { POST } from "../../..";
import { destroyClient } from "../../../auth";

POST("/auth/session/logout", async (params) => {
  if (params.authenticated) destroyClient(params.authenticated);
  return undefined;
});
