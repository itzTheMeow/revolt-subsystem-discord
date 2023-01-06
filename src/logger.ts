import config from "./config";

export const Logger = {
  log(text: string) {
    console.log(`[${new Date().toLocaleTimeString()}] ${text}`);
  },
  debug(text: string) {
    if (config.debug) Logger.log(`[Debug] ${text}`);
  },
};
