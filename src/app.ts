import express from "express";
import screenshot from "screenshot-desktop";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  try {
    const img = await screenshot();
    res.contentType("image/png");
    res.send(img);
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, "::", () => {
  console.log(`Server running at http://:::${port}`);
});
