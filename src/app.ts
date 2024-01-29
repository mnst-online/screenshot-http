import express from "express";
import screenshot from "screenshot-desktop";
import { join } from "path";
import NodeCache from "node-cache";

const pngCache = new NodeCache({ stdTTL: 0.5, checkperiod: 120 });
const pngCacheKey = "png";

const app = express();
const port = 3000;

app.use(express.static(join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

app.get("/png", async (_, res) => {
  try {
    const cacheData = pngCache.get(pngCacheKey);
    if (cacheData) {
      res.contentType("image/png");
      return res.send(cacheData);
    }
    const img = await screenshot();
    res.contentType("image/png");
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
