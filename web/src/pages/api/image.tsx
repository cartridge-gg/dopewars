import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import satori from "satori";
import { join } from "path";
import * as fs from "fs";
import IconImg from "./../../../public/images/image.svg";
import Image from "next/image";
// import { Image } from "@chakra-ui/react";
// import Image from "next/image";

const fontPath = join(process.cwd(), "public/fonts", "broken-console-broken-console-regular-400.ttf");
const ppmondwestFontPath = join(process.cwd(), "public/fonts", "PPMondwest-Regular.otf");
const dosWAgaFontPath = join(process.cwd(), "public/fonts", "DOS_VGA.ttf");

const imagePath = join(process.cwd(), "public/images", "avatar.svg");
console.log("font Path", fontPath);
let fontData = fs.readFileSync(fontPath);
let ppmondwestFontData = fs.readFileSync(ppmondwestFontPath);
let dosWAgaFontData = fs.readFileSync(dosWAgaFontPath);
let imageData = fs.readFileSync(imagePath);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const score = req.query["score"];
    if (!score) {
      return res.status(400).send("Missing Score");
    }

    const svg = await satori(
      <div
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#172217",
          padding: 50,
          lineHeight: 1.2,
          fontSize: 24,
          color: "#11ED83",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              letterSpacing: "0.25em",
              marginBottom: "0",
              textTransform: "uppercase",
              fontFamily: "broken-console , sans-serif",
            }}
          >
            DOPE WARS
          </p>
          <p style={{ textAlign: "center", fontSize: "48px", lineHeight: "1.2" }}>Roll Your Own</p>

          <div style={{ display: "flex" }}>
            <Image src={imagePath} alt="HI" width={200} height={300} />
            hi
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            padding: 20,
            border: "1px solid #1C291C",
            borderRadius: "6px",
          }}
        >
          {/* <Image src="/public/images/dealer.png" alt="cash suitcase" width={200} height={200} /> */}
          <Image src="/images/events/smoking_gun.gif" alt="rip" />
          <Image src="/images/landing/main.png" alt="hi" width={200} height={200} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2
              style={{
                fontSize: "56px",
              }}
            >
              Click_save
            </h2>
            <div
              style={{
                paddingBottom: "3rem",
                borderBottom: "2px solid #1C291C",
              }}
            >
              Stars
            </div>

            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                marginTop: "3rem",
                fontFamily: "dos-waga , sans-serif",
              }}
            >
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img
                  src="https://graduate.northeastern.edu/resources/wp-content/uploads/sites/4/2019/09/iStock-1150384596-2.jpg"
                  alt="cash suitcase"
                  width="30"
                />
                <p style={{ margin: "0" }}>{score}</p>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img
                  src="https://graduate.northeastern.edu/resources/wp-content/uploads/sites/4/2019/09/iStock-1150384596-2.jpg"
                  alt="cash suitcase"
                  width="30"
                />
                <p style={{ margin: "0" }}>Day 24</p>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Image
                  src="https://graduate.northeastern.edu/resources/wp-content/uploads/sites/4/2019/09/iStock-1150384596-2.jpg"
                  alt="cash suitcase"
                  width="30"
                />
                <p style={{ margin: "0" }}>55 HP</p>
              </li>
            </ul>
          </div>
        </div>
      </div>,
      {
        width: 1000,
        height: 600,
        fonts: [
          {
            data: ppmondwestFontData,
            name: "ppmondwest",
            style: "normal",
            weight: 400,
          },
          {
            data: fontData,
            name: "broken-console",
            style: "normal",
            weight: 400,
          },
          {
            data: dosWAgaFontData,
            name: "dos-waga",
            style: "normal",
            weight: 400,
          },
        ],
        // debug: true,
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
