import { useRef, useEffect } from 'react';

interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  characters?: string;
  isExiting?: boolean;
  onExitComplete?: () => void;
  exitStaggerMs?: number;
  exitDurationMs?: number;
}

interface LetterState {
  char: string;
  color: string;
  targetColor: string;
  colorProgress: number;
  alpha: number;
  exitDelay: number;
}

const LetterGlitch: React.FC<LetterGlitchProps> = ({
  glitchColors = ['#2b4539', '#61dca3', '#61b3dc'],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789',
  isExiting = false,
  onExitComplete,
  exitStaggerMs = 800,
  exitDurationMs = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const letters = useRef<LetterState[]>([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef(Date.now());

  // exit-animation bookkeeping
  const isExitingRef = useRef(isExiting);
  const exitStartTime = useRef<number | null>(null);
  const exitAssigned = useRef(false);
  const exitCompleteCalled = useRef(false);
  const onExitCompleteRef = useRef(onExitComplete);
  const exitStaggerRef = useRef(exitStaggerMs);
  const exitDurationRef = useRef(exitDurationMs);

  useEffect(() => {
    onExitCompleteRef.current = onExitComplete;
  }, [onExitComplete]);

  useEffect(() => {
    exitStaggerRef.current = exitStaggerMs;
    exitDurationRef.current = exitDurationMs;
  }, [exitStaggerMs, exitDurationMs]);

  useEffect(() => {
    isExitingRef.current = isExiting;
    if (isExiting) {
      if (!exitAssigned.current) {
        letters.current.forEach((letter) => {
          letter.exitDelay = Math.random() * exitStaggerRef.current;
        });
        exitAssigned.current = true;
      }
      exitStartTime.current = Date.now();
      exitCompleteCalled.current = false;
    } else {
      exitStartTime.current = null;
      exitAssigned.current = false;
      exitCompleteCalled.current = false;
      letters.current.forEach((letter) => {
        letter.alpha = 1;
      });
    }
  }, [isExiting]);

  const lettersAndSymbols = Array.from(characters);

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const getRandomChar = (): string => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  };

  const getRandomColor = (): string => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  };

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number
  ) => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor),
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  };

  const calculateGrid = (width: number, height: number) => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    return { columns, rows };
  };

  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows };
    const totalLetters = columns * rows;
    letters.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
      alpha: 1,
      exitDelay: 0,
    }));
    exitAssigned.current = false;
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawLetters();
  };

  const drawLetters = () => {
    if (!context.current || letters.current.length === 0) return;
    const ctx = context.current;
    const { width, height } = canvasRef.current!.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    letters.current.forEach((letter, index) => {
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.globalAlpha = letter.alpha;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });

    ctx.globalAlpha = 1;
  };

  const updateLetters = () => {
    if (!letters.current || letters.current.length === 0) return;

    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      if (!letters.current[index]) continue;

      letters.current[index].char = getRandomChar();
      letters.current[index].targetColor = getRandomColor();

      if (!smooth) {
        letters.current[index].color = letters.current[index].targetColor;
        letters.current[index].colorProgress = 1;
      } else {
        letters.current[index].colorProgress = 0;
      }
    }
  };

  const handleSmoothTransitions = () => {
    let needsRedraw = false;
    letters.current.forEach((letter) => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;

        const startRgb = hexToRgb(letter.color);
        const endRgb = hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
          needsRedraw = true;
        }
      }
    });

    if (needsRedraw) {
      drawLetters();
    }
  };

  const updateExitProgress = () => {
    if (exitStartTime.current === null) return false;

    const now = Date.now();
    let allDone = true;

    letters.current.forEach((letter) => {
      const elapsed = now - exitStartTime.current! - letter.exitDelay;
      if (elapsed <= 0) {
        letter.alpha = 1;
        allDone = false;
      } else {
        const progress = Math.min(elapsed / exitDurationRef.current, 1);
        letter.alpha = 1 - progress;
        if (progress < 1) allDone = false;
      }
    });

    if (allDone && !exitCompleteCalled.current) {
      exitCompleteCalled.current = true;
      onExitCompleteRef.current?.();
    }

    return true;
  };

  const animate = () => {
    const now = Date.now();

    if (isExitingRef.current) {
      updateExitProgress();
      drawLetters();
    } else {
      if (now - lastGlitchTime.current >= glitchSpeed) {
        updateLetters();
        drawLetters();
        lastGlitchTime.current = now;
      }

      if (smooth) {
        handleSmoothTransitions();
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

  context.current = canvas.getContext('2d');
    resizeCanvas();
    animate();

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef.current as number);
        resizeCanvas();
        animate();
      }, 100);
    };

    // Catches layout changes that don't fire a window 'resize' event —
    // e.g. the scrollbar disappearing when body overflow is toggled hidden.
    const parent = canvas.parentElement;
    let ro: ResizeObserver | null = null;
    if (parent) {
      ro = new ResizeObserver(handleResize);
      ro.observe(parent);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener('resize', handleResize);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed, smooth]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    overflow: 'hidden',
  };

  const canvasStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
  };

  const outerVignetteStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)',
  };

  const centerVignetteStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
  };

  return (
    <div style={containerStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      {outerVignette && <div style={outerVignetteStyle}></div>}
      {centerVignette && <div style={centerVignetteStyle}></div>}
    </div>
  );
};

export default LetterGlitch;