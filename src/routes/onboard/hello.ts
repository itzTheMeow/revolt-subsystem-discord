import { GET } from "../..";

GET("/onboard/hello", async () => {
  return {
    onboarding: false,
  };
});
