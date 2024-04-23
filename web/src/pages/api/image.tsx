import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import satori from "satori";
import { join } from "path";
import * as fs from "fs";

const fontPath = join(process.cwd(), "public/fonts", "broken-console-broken-console-regular-400.ttf");
console.log("font Path", fontPath);
let fontData = fs.readFileSync(fontPath);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const score = req.query["score"];
    if (!score) {
      return res.status(400).send("Missing Score");
    }

    const svg = await satori(
      <div
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "f4f4f4",
          padding: 50,
          lineHeight: 1.2,
          fontSize: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 20,
          }}
        >
          <h2 style={{ textAlign: "center", color: "lightgray" }}>{score}</h2>
        </div>
      </div>,
      {
        width: 600,
        height: 400,
        fonts: [
          {
            data: fontData,
            name: "broken-console",
            style: "normal",
            weight: 400,
          },
        ],
      },
    );

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

    // Set the content type to PNG and send the response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "max-age=10");
    res.send(pngBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
}
