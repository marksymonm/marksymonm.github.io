import { useEffect, useState } from "react";
import LetterGlitch from "./LetterGlitch";
import "./Preloader.css";

interface PreloaderProps {
  onComplete: () => void;
}

type Phase =
  | "glitch"
  | "exiting"
  | "terminal"
  | "typing"
  | "fade";

const GLITCH_MS = 1500;
const EXIT_STAGGER_MS = 500;
const TERMINAL_MS = 1100;
const TYPING_MS = 2300;
const FADE_MS = 700;


export default function Preloader({ onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<Phase>("glitch");

  // stable random stagger per tile, generated once (used only for the final reveal wipe)
//   const tileDelays = useMemo(
//     () => Array.from({ length: TILE_COUNT }, () => Math.random() * 380),
//     []
//   );

    useEffect(() => {
    if (phase === "exiting") return;

    const timers: Partial<Record<Phase, number>> = {
        glitch: GLITCH_MS,
        terminal: TERMINAL_MS,
        typing: TYPING_MS,
        fade: FADE_MS,
    };

    const next: Partial<Record<Phase, Phase | null>> = {
        glitch: "exiting",
        terminal: "typing",
        typing: "fade",
        fade: null,
    };

    const duration = timers[phase];
    if (!duration) return;

    const t = setTimeout(() => {
        const nextPhase = next[phase];

        if (nextPhase) {
        setPhase(nextPhase);
        } else {
        onComplete();
        }
    }, duration);

    return () => clearTimeout(t);
    }, [phase, onComplete]);

  // LetterGlitch is mounted for both "glitch" and "exiting" (it handles its own fade-out)
  const showGlitch = phase === "glitch" || phase === "exiting";
  useEffect(() => {
    if (phase !== "exiting") return;
    const fallback = setTimeout(() => setPhase("terminal"), EXIT_STAGGER_MS + 500);
    return () => clearTimeout(fallback);
  }, [phase]);


  return (
    <div
    className={`preloader ${
        phase === "fade" ? "preloader-fade" : ""
    }`}
    >
      {showGlitch && (
        <div className="preloader-glitch-bg">
          <LetterGlitch
            glitchColors={["#1a1a1a", "#6a6a6a", "#858585"]}
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            isExiting={phase === "exiting"}
            exitStaggerMs={EXIT_STAGGER_MS}
            onExitComplete={() => setPhase("terminal")}          />
        </div>
      )}

      {/* {showTiles && (
        <div className={`preloader-tiles ${tilesClass}`}>
          {tileDelays.map((delay, i) => (
            <span
              key={i}
              className="preloader-tile"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      )} */}

      {phase === "terminal" && (
        <div className="preloader-welcome">

            <div className="terminal">
            <p>&gt; Initializing Portfolio...</p>
            <p>&gt; Loading UI Components...</p>
            <p>&gt; Optimizing Experience...</p>
            {/* <p className="terminal-ready">✓ Ready.</p> */}
            </div>

        </div>
        )}

        {phase === "typing" && (
        <div className="preloader-welcome">
            <h1 className="typing-title">
            welcome to my portfolio
            </h1>
        </div>
        )}

        {phase === "fade" && (
        <div className="preloader-welcome preloader-welcome-exit">
            <h1 className="typing-title typed">
            welcome to my portfolio
            </h1>
        </div>
        )}
    </div>
  );
}