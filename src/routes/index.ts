import { GET } from "..";

GET("/", async (_, req) => {
  return {
    revolt: "0.5.5", // hardcoded
    features: {
      //TODO: dont hardcode this
      captcha: { enabled: true, key: "3daae85e-09ab-4ff6-9f24-e8f4f335e433" },
      email: true,
      invite_only: false,
      autumn: {
        enabled: true,
        url: `http${req.secure ? "s" : ""}://${req.get("host")}/attachments`,
      },
      //TODO: dont hardcode this
      january: { enabled: true, url: "https://jan.revolt.chat" },
      // voice is not supported
      voso: { enabled: false, url: "", ws: "" },
    },
    ws: `ws${req.secure ? "s" : ""}://${req.get("host")}`,
    //TODO: dont hardcode this
    app: "https://app.revolt.chat",
    vapid: "", // no vapid support
    build: {
      commit_sha: "<failed to generate>",
      commit_timestamp: "<failed to generate>",
      semver: "<failed to generate>",
      origin_url: "<failed to generate>",
      timestamp: "<failed to generate>",
    },
  };
});
