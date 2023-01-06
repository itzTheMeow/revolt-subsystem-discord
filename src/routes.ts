import fs from "fs";
import path from "path";

export default function initRoutes(p = path.join(process.cwd(), "dist/routes")) {
  fs.readdirSync(p).forEach((d) => {
    const pd = path.join(p, d);
    if (d.endsWith(".js")) require(pd);
    else if (fs.statSync(pd).isDirectory()) initRoutes(pd);
  });
}
