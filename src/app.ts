import express from "express";
import NodeCache from "node-cache";
import os from "os";
import { join } from "path";
import screenshot from "screenshot-desktop";
import { environment } from "./environment";

const ttlSeconds = 0.5;

const pngCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: 120 });
const pngCacheKey = "png";

const app = express();
const port = environment.nodePort;

app.use(express.static(join(__dirname, "public")));

app.get("/", (_, res) => res.sendFile(join(__dirname, "public", "index.html")));

app.get("/png", async (_, res) => {
  const headers = {
    "Cache-Control": "public, max-age=" + ttlSeconds,
    Expires: new Date(Date.now() + ttlSeconds * 1000).toUTCString(),
    "Content-Type": "image/png",
    "Content-Disposition": `inline; filename=${new Date().getTime().toString()}`,
  };
  try {
    const cacheData = pngCache.get(pngCacheKey);
    if (cacheData) {
      res.set(headers);
      return res.send(cacheData);
    }
    const img = await screenshot();
    res.set(headers);
    res.send(img);
    pngCache.set(pngCacheKey, img);
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    res.status(500).send("Internal Server Error");
  }
});

const networkInterfaces = os.networkInterfaces();

app.listen(port, environment.nodeHost, () => {
  console.log("Server running at port", port);
  Object.entries(networkInterfaces)
    .map(([, value]) => (value ?? []).filter(item => item.family === "IPv4" && !item.internal).at(0)?.address)
    .filter((address): address is string => !!address)
    .forEach(address => console.log(`Server Address: ${address}:${port}`));
});
