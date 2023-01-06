import { GET } from "../..";

GET("-/users/{target}/profile", async (params) => {
  return {
    background: null,
    content: null,
  };
});
