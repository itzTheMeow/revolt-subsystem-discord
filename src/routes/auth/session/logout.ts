import { POST } from "../../..";
import { destroyClient } from "../../../auth";

POST("/auth/session/logout", async (params) => {
  destroyClient(params.authenticated);
  return undefined;
});
