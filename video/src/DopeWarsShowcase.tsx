import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

const NEON_GREEN = "#11ED83";
const DARK_BG = "#172217";

const ScreenScene: React.FC<{
  src: string;
  label: string;
  sublabel?: string;
}> = ({ src, label, sublabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label fades in then out
  const labelOpacity = interpolate(
    frame,
    [0, 0.3 * fps, 0.6 * fps, 1.2 * fps],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" },
  );

  // Subtle zoom on the screenshot
  const scale = interpolate(frame, [0, 3 * fps], [1.02, 1.0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      {/* Overlay label */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: labelOpacity,
          gap: 4,
        }}
      >
        <div
          style={{
            background: "rgba(23, 34, 23, 0.85)",
            border: `2px solid ${NEON_GREEN}`,
            padding: "10px 24px",
            fontFamily: "monospace",
            fontSize: 18,
            fontWeight: 700,
            color: NEON_GREEN,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textShadow: `0 0 10px ${NEON_GREEN}`,
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: NEON_GREEN,
              opacity: 0.7,
              letterSpacing: "0.1em",
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 0.5 * fps], [30, 0], {
    extrapolateRight: "clamp",
  });
  const subtitleOpacity = interpolate(
    frame,
    [0.5 * fps, 1.0 * fps],
    [0, 1],
    { extrapolateRight: "clamp" },
  );
  const lineWidth = interpolate(frame, [0.3 * fps, 0.8 * fps], [0, 200], {
    extrapolateRight: "clamp",
  });

  // Scanline effect
  const scanlineY = (frame * 3) % 844;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Scanline */}
      <div
        style={{
          position: "absolute",
          top: scanlineY,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${NEON_GREEN}22, transparent)`,
        }}
      />

      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: "monospace",
          fontSize: 42,
          fontWeight: 900,
          color: NEON_GREEN,
          textShadow: `0 0 20px ${NEON_GREEN}, 0 0 40px ${NEON_GREEN}44`,
          letterSpacing: "0.1em",
          textAlign: "center",
        }}
      >
        DOPE WARS
      </div>

      <div
        style={{
          width: lineWidth,
          height: 2,
          backgroundColor: NEON_GREEN,
          marginTop: 12,
          marginBottom: 12,
          boxShadow: `0 0 10px ${NEON_GREEN}`,
        }}
      />

      <div
        style={{
          opacity: subtitleOpacity,
          fontFamily: "monospace",
          fontSize: 14,
          color: NEON_GREEN,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
      >
        Game Walkthrough
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const glowPulse = interpolate(
    frame,
    [0, 0.5 * fps, 1.0 * fps, 1.5 * fps],
    [0, 20, 10, 20],
    { extrapolateRight: "extend" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: DARK_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 36,
          fontWeight: 900,
          color: NEON_GREEN,
          textShadow: `0 0 ${glowPulse}px ${NEON_GREEN}`,
          letterSpacing: "0.1em",
        }}
      >
        DOPE WARS
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily: "monospace",
          fontSize: 16,
          color: NEON_GREEN,
          opacity: 0.8,
          letterSpacing: "0.2em",
        }}
      >
        PLAY NOW AT RYO.GAME
      </div>
    </AbsoluteFill>
  );
};

export const DopeWarsShowcase: React.FC = () => {
  const transitionDuration = 12;
  const timing = linearTiming({ durationInFrames: transitionDuration });

  return (
    <TransitionSeries>
      {/* Intro */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={timing}
      />

      {/* Home / Lobby */}
      <TransitionSeries.Sequence durationInFrames={55}>
        <ScreenScene src="home.png" label="The Lobby" sublabel="Choose your game mode" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={timing}
      />

      {/* Travel */}
      <TransitionSeries.Sequence durationInFrames={50}>
        <ScreenScene src="travel.png" label="Travel" sublabel="Pick your destination" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={timing}
      />

      {/* Location Market */}
      <TransitionSeries.Sequence durationInFrames={50}>
        <ScreenScene src="location.png" label="The Market" sublabel="Buy low, sell high" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={timing}
      />

      {/* Drug Trade */}
      <TransitionSeries.Sequence durationInFrames={45}>
        <ScreenScene src="drug-trade-buy.png" label="Trade" sublabel="Stack your inventory" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={timing}
      />

      {/* Pawn Shop */}
      <TransitionSeries.Sequence durationInFrames={45}>
        <ScreenScene src="pawnshop.png" label="Pawn Shop" sublabel="Upgrade your gear" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: 8 })}
      />

      {/* Encounter - Cops */}
      <TransitionSeries.Sequence durationInFrames={50}>
        <ScreenScene src="decision-cops.png" label="Encounter!" sublabel="Fight, run, or pay?" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 8 })}
      />

      {/* Consequence */}
      <TransitionSeries.Sequence durationInFrames={45}>
        <ScreenScene src="consequence-victory.png" label="Victory" sublabel="You won the fight" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={timing}
      />

      {/* Game Over */}
      <TransitionSeries.Sequence durationInFrames={55}>
        <ScreenScene src="game-over-ranked.png" label="Game Over" sublabel="Check your rank" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />

      {/* Outro */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
