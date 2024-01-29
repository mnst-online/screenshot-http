import express from "express";
import screenshot from "screenshot-desktop";
import { join } from "path";
import NodeCache from "node-cache";

const ttlSeconds = 0.5;

const pngCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: 120 });
const pngCacheKey = "png";

const app = express();
const port = 3000;

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

app.listen(port, "::", () => {
  console.log(`Server running at http://:::${port}`);
});
