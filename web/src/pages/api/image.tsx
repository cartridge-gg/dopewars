/* eslint-disable @next/next/no-img-element */
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import satori from "satori";
import { join } from "path";
import * as fs from "fs";
import url from "util";

const fontPath = join(process.cwd(), "public/fonts", "broken-console-broken-console-regular-400.ttf");
const ppmondwestFontPath = join(process.cwd(), "public/fonts", "PPMondwest-Regular.otf");
const dosWAgaFontPath = join(process.cwd(), "public/fonts", "DOS_VGA.ttf");

const cashboxImg = fs.readFileSync(join(process.cwd(), "public/images", "cashbox.png"));
const playnowImg = fs.readFileSync(join(process.cwd(), "public/images", "playnow.png"));
const avatarImg = fs.readFileSync(join(process.cwd(), "public/images", "avatar.png"));
const cashIcon = fs.readFileSync(join(process.cwd(), "public/images", "cash_icon.png"));
const calendarIcon = fs.readFileSync(join(process.cwd(), "public/images", "calendar.png"));
const heartIcon = fs.readFileSync(join(process.cwd(), "public/images", "heart.png"));

let fontData = fs.readFileSync(fontPath);
let ppmondwestFontData = fs.readFileSync(ppmondwestFontPath);
let dosWAgaFontData = fs.readFileSync(dosWAgaFontPath);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { rating, cash, day, hp, name } = req.query;

    if (!rating || !cash || !day || !hp || !name) {
      return res.status(400).send("Invalid query. query should have rating, cash, day, hp, and name.");
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1" }}>
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
            DOPE WARS:
          </p>
          <p style={{ textAlign: "center", fontSize: "48px", lineHeight: "1.2" }}>Roll Your Own</p>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <img
              src={`data:image/png;base64,${cashboxImg.toString("base64")}`}
              alt="Cashbox"
              width="120"
              height="120"
            />
            <img
              src={`data:image/png;base64,${playnowImg.toString("base64")}`}
              alt="Play Now"
              width="258"
              height="64"
              style={{ marginTop: "40px" }}
            />
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
            flex: 1,
          }}
        >
          <img src={`data:image/png;base64,${avatarImg.toString("base64")}`} alt="Avatar" width="50%" />

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
              {name}
            </h2>
            <div
              style={{
                paddingBottom: "1rem",
                borderBottom: "2px solid #1C291C",
              }}
            >
              Stars
            </div>

            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
                fontFamily: "dos-waga , sans-serif",
              }}
            >
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img src={`data:image/png;base64,${cashIcon.toString("base64")}`} alt="Cash" width="40" height="40" />
                <p style={{ margin: "0" }}>{cash}</p>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img
                  src={`data:image/png;base64,${calendarIcon.toString("base64")}`}
                  alt="Calendar"
                  width="40"
                  height="40"
                />
                <p style={{ margin: "0" }}>Day {day}</p>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img src={`data:image/png;base64,${heartIcon.toString("base64")}`} alt="Heart" width="40" height="40" />
                <p style={{ margin: "0" }}>{hp} HP</p>
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
