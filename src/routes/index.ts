import { GET } from "..";

GET("/", async (_, req) => {
  return {
    revolt: "0.5.5", // hardcoded
    features: {
      //TODO: dont hardcode this
      captcha: { enabled: true, key: "3daae85e-09ab-4ff6-9f24-e8f4f335e433" },
      email: true,
      invite_only: false,
      autumn: { enabled: true, url: "https://autumn.revolt.chat" },
      //TODO: dont hardcode this
      january: { enabled: true, url: "https://jan.revolt.chat" },
      // voice is not supported
      voso: { enabled: false, url: "", ws: "" },
    },
    ws: `ws${req.secure ? "s" : ""}://${req.get("host")}`,
    //TODO: dont hardcode this
    app: "https://app.revolt.chat",
    vapid: "", // no vapid support
  };
});
