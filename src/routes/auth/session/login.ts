import { ulid } from "ulid";
import { POST } from "../../..";
import { destroyClient, doAuthenticate } from "../../../auth";
import config from "../../../config";
import { snowflakeToULID } from "../../../conversion/ulid";
import { Logger } from "../../../logger";

POST("/auth/session/login", async (params) => {
  try {
    if ("email" in params) {
      const client = await doAuthenticate(params.password);
      if (client) {
        destroyClient(client);
        return {
          _id: ulid(),
          user_id: snowflakeToULID(client.user.id),
          result: "Success",
          token: params.password + config.delimiter + Buffer.from(params.email).toString("base64"),
          name: `${client.user.tag} on Discord`,
        };
      } else
        return <any>{
          type: "InvalidCredentials",
        };
    } else {
      return <any>{
        type: "InvalidCredentials",
      };
    }
  } catch (err) {
    Logger.debug(err);
    return <any>{
      type: "InvalidCredentials",
    };
  }
});
