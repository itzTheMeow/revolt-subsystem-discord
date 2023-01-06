import { GET } from "../..";

GET("-/servers/{target}/members", async (params) => {
  return {
    users: [],
    members: [],
  };
});
