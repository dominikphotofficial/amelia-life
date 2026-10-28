import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../services/sound';
import { Volume2, VolumeX, ArrowRight, Trophy } from 'lucide-react';
import { Language } from '../types';

interface SwimmingMinigameProps {
  language: Language;
  difficulty: 'practice' | 'time_trial' | 'championship';
  onComplete: (stats: { timeSeconds: number; wonVsDima: boolean; score: number; perfectStrokes?: number }) => void;
  onExit: () => void;
}

export const SwimmingMinigame: React.FC<SwimmingMinigameProps> = ({
  language,
  difficulty,
  onComplete,
  onExit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<{ time: number; won: boolean; rating: string } | null>(null);
  const [muted, setMuted] = useState(sound.getMuted());
  const [breathMeter, setBreathMeter] = useState(50);
  const [stamina, setStamina] = useState(100);
  const [distanceDisplay, setDistanceDisplay] = useState(0);
  const [elapsedDisplay, setElapsedDisplay] = useState('00:00.00');
  const [ratingFeedback, setRatingFeedback] = useState<{ text: string; color: string; key: number } | null>(null);

  const isLt = language === 'lt';

  const sim = useRef({
    targetDistance: difficulty === 'championship' ? 100 : 50,
    playerDistance: 0,
    dimaDistance: 0,
    playerSpeed: 0,
    dimaSpeed: 0,
    lastStrokeSide: null as 'left' | 'right' | null,
    breathValue: 50,
    breathDirection: 1,
    stamina: 100,
    startTime: 0,
    finishTime: 0,
    perfectStrokes: 0,
    totalStrokes: 0,
    raceStarted: false,
    particles: [] as { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; color: string }[],
  });

  const triggerFeedback = (text: string, color: string) => {
    setRatingFeedback({ text, color, key: Date.now() });
  };

  const handleStroke = (side: 'left' | 'right') => {
    if (raceFinished || isPaused) return;
    const s = sim.current;

    if (!s.raceStarted) {
      s.raceStarted = true;
      s.startTime = performance.now();
      sound.playSfx('whistle');
    }

    const isAlternating = s.lastStrokeSide !== side;
    s.lastStrokeSide = side;
    s.totalStrokes++;

    const breathDelta = Math.abs(s.breathValue - 50);
    let boost = 1.0;

    if (isAlternating) {
      if (breathDelta <= 14) {
        boost = 1.6;
        s.perfectStrokes++;
        s.stamina = Math.min(100, s.stamina + 4);
        triggerFeedback(isLt ? 'TOBULAS GRYBŠNIS! +GREITIS' : 'PERFECT STROKE! +SPEED', 'text-cyan-300');
        sound.playSfx('splash');
      } else if (breathDelta <= 28) {
        boost = 1.25;
        triggerFeedback(isLt ? 'PUIKUS RITMAS' : 'GREAT RHYTHM', 'text-emerald-300');
        sound.playSfx('splash');
      } else {
        boost = 0.95;
        s.stamina = Math.max(10, s.stamina - 2);
        triggerFeedback(isLt ? 'PRALEISTAS ĮKVĖPIMAS' : 'OFF-BEAT BREATH', 'text-amber-300');
        sound.playSfx('splash');
      }
    } else {
      boost = 0.6;
      s.stamina = Math.max(10, s.stamina - 4);
      triggerFeedback(isLt ? 'KEISK RANKAS (K / D)' : 'ALTERNATE ARMS (L / R)', 'text-rose-400');
    }

    const staminaFactor = Math.max(0.4, s.stamina / 100);
    const speedImpulse = 2.4 * boost * staminaFactor;
    s.playerSpeed = Math.min(18.0, s.playerSpeed + speedImpulse);

    for (let i = 0; i < 6; i++) {
      s.particles.push({
        x: side === 'left' ? 240 : 280,
        y: 200,
        vx: (Math.random() - 0.5) * 60 + (side === 'left' ? -20 : 20),
        vy: Math.random() * 80 + 30,
        radius: Math.random() * 3.5 + 1.5,
        alpha: 0.9,
        color: '#67e8f9',
      });
    }
  };

  const handleBreathSync = () => {
    if (raceFinished || isPaused) return;
    const s = sim.current;
    const breathDelta = Math.abs(s.breathValue - 50);
    if (breathDelta <= 16) {
      s.stamina = Math.min(100, s.stamina + 16);
      s.playerSpeed += 1.2;
      triggerFeedback(isLt ? 'DEGUONIES GŪSIS! 💨' : 'OXYGEN SURGE! 💨', 'text-sky-300');
      sound.playSfx('breath');
    } else {
      s.stamina = Math.max(10, s.stamina - 6);
      triggerFeedback(isLt ? 'NETINKAMAS ĮKVĖPIMAS' : 'CHOKED BREATH', 'text-amber-400');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        handleStroke('left');
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        handleStroke('right');
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleBreathSync();
      } else if (e.key === 'Escape') {
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [raceFinished, isPaused, language]);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const rawDt = (time - lastTime) / 1000;
      const dt = Math.min(rawDt, 0.05);
      lastTime = time;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const s = sim.current;

      if (!isPaused && !raceFinished) {
        s.breathValue += s.breathDirection * dt * 90;
        if (s.breathValue >= 100) {
          s.breathValue = 100;
          s.breathDirection = -1;
        } else if (s.breathValue <= 0) {
          s.breathValue = 0;
          s.breathDirection = 1;
        }

        s.playerSpeed = Math.max(0, s.playerSpeed - 4.2 * dt);

        if (s.raceStarted) {
          s.playerDistance += s.playerSpeed * dt * 2.2;

          const targetDimaSpeed =
            difficulty === 'championship'
              ? 8.4 + Math.sin(time * 0.003) * 1.8
              : difficulty === 'time_trial'
              ? 7.6 + Math.cos(time * 0.002) * 1.4
              : 6.8 + Math.sin(time * 0.001) * 1.2;

          s.dimaSpeed += (targetDimaSpeed - s.dimaSpeed) * dt * 2.5;
          s.dimaDistance += s.dimaSpeed * dt * 2.1;

          setDistanceDisplay(Math.min(s.targetDistance, Math.floor(s.playerDistance)));
          setBreathMeter(Math.floor(s.breathValue));
          setStamina(Math.floor(s.stamina));

          const curElapsed = (time - s.startTime) / 1000;
          const mins = Math.floor(curElapsed / 60);
          const secs = (curElapsed % 60).toFixed(2).padStart(5, '0');
          setElapsedDisplay(`${mins.toString().padStart(2, '0')}:${secs}`);

          if (s.playerDistance >= s.targetDistance && !raceFinished) {
            s.finishTime = curElapsed;
            const won = s.playerDistance >= s.dimaDistance;
            setRaceFinished(true);
            sound.playSfx(won ? 'cheer' : 'whistle');
            const accuracy = s.totalStrokes > 0 ? (s.perfectStrokes / s.totalStrokes) * 100 : 70;
            const rating = accuracy >= 65 ? (isLt ? 'AUKSAS' : 'GOLD RECORD') : accuracy >= 40 ? (isLt ? 'SIDABRAS' : 'SILVER') : (isLt ? 'BRONZA' : 'BRONZE');
            setFinalResult({
              time: Number(s.finishTime.toFixed(2)),
              won,
              rating,
            });
          }
        }
      }

      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= dt * 1.6;
        if (p.alpha <= 0) {
          s.particles.splice(i, 1);
        }
      }

      const w = canvas.width;
      const h = canvas.height;

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0c4a6e');
      grad.addColorStop(0.5, '#0369a1');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 7; i++) {
        const waveY = (time * 0.05 + i * 85) % h;
        ctx.beginPath();
        ctx.moveTo(0, waveY);
        for (let x = 0; x <= w; x += 30) {
          const cy = waveY + Math.sin(x * 0.02 + time * 0.003) * 8;
          ctx.lineTo(x, cy);
        }
        ctx.stroke();
      }

      const laneWidth = w / 3;
      const drawLaneRope = (xPos: number) => {
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, h);
        ctx.stroke();

        const buoySpacing = 28;
        const buoyOffset = (s.playerDistance * 20) % buoySpacing;
        for (let y = -buoySpacing; y < h + buoySpacing; y += buoySpacing) {
          const buoyY = y + buoyOffset;
          const isRed = Math.floor(y / buoySpacing) % 2 === 0;
          ctx.fillStyle = isRed ? '#ef4444' : '#f8fafc';
          ctx.beginPath();
          ctx.arc(xPos, buoyY, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      drawLaneRope(laneWidth);
      drawLaneRope(laneWidth * 2);

      const lane4X = laneWidth * 0.5;
      const lane5X = laneWidth * 1.5;

      const distRemaining = s.targetDistance - s.playerDistance;
      if (distRemaining < 15) {
        const wallY = h - distRemaining * (h / 15);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(0, wallY - 8, w, 16);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px "Plus Jakarta Sans"';
        ctx.fillText(isLt ? 'FINIŠAS · 100M' : 'FINISH · 100M', w / 2 - 60, wallY + 4);
      }

      // Draw Dima
      const dimaRelY = 200 + (s.playerDistance - s.dimaDistance) * 12;
      ctx.save();
      ctx.translate(lane5X, Math.max(70, Math.min(h - 70, dimaRelY)));

      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 30, 20, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, -16, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "Plus Jakarta Sans"';
      ctx.textAlign = 'center';
      ctx.fillText('DIMA (5)', 0, -28);
      ctx.restore();

      // Draw Amelia
      const ameliaY = 200;
      ctx.save();
      ctx.translate(lane4X, ameliaY);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 32, 22, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-10, -7, 2.5, 20);
      ctx.fillRect(7.5, -7, 2.5, 20);

      ctx.fillStyle = '#0369a1';
      ctx.beginPath();
      ctx.arc(0, -15, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px "Outfit"';
      ctx.textAlign = 'center';
      ctx.fillText(isLt ? 'AMELIJA (4)' : 'AMELIA (4)', 0, -28);
      ctx.restore();

      for (const p of s.particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, raceFinished, difficulty, isLt]);

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col items-center justify-between bg-slate-950 overflow-hidden font-sans select-none p-2 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {/* Top Status Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-2 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex flex-col bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-sky-500/20 shadow-md">
            <span className="text-[9px] text-sky-400 font-semibold uppercase">{isLt ? 'Distancija' : 'Distance'}</span>
            <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-white">
              {distanceDisplay}/{sim.current.targetDistance}m
            </span>
          </div>
          <div className="flex flex-col bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-sky-500/20 shadow-md">
            <span className="text-[9px] text-sky-400 font-semibold uppercase">{isLt ? 'Laikas' : 'Timer'}</span>
            <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-sky-200">
              {elapsedDisplay}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              const isNowMuted = sound.toggleMute();
              setMuted(isNowMuted);
            }}
            className="p-2 rounded-xl bg-slate-900/80 text-sky-300 border border-sky-500/20"
            title="Garsas"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onExit}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-700 text-xs font-semibold"
          >
            {isLt ? 'Išlipti' : 'Exit'}
          </button>
        </div>
      </div>

      {/* Dynamic Feedback */}
      {ratingFeedback && (
        <div
          key={ratingFeedback.key}
          className={`z-20 font-display font-extrabold text-sm sm:text-xl drop-shadow tracking-wide ${ratingFeedback.color} -my-1`}
        >
          {ratingFeedback.text}
        </div>
      )}

      {/* Responsive Canvas Container */}
      <div className="relative w-full max-w-2xl flex-1 flex items-center justify-center min-h-0 my-1">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full max-h-[46vh] sm:max-h-[500px] rounded-2xl shadow-xl border border-sky-900/40 bg-sky-950 cursor-pointer object-contain"
          onClick={() => handleStroke(Math.random() > 0.5 ? 'left' : 'right')}
        />
      </div>

      {/* Bottom Controls Cockpit: Phone Thumb-Friendly */}
      <div className="w-full max-w-2xl bg-slate-900/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-4 border border-sky-500/20 shadow-xl flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-sky-200 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            {isLt ? 'Kvėpavimas (SPACE žalioje zonoje)' : 'Breath (SPACE in Green Zone)'}
          </span>
          <span className="font-mono tabular-nums text-slate-400">
            {isLt ? 'Ištvermė' : 'Stamina'}: {stamina}%
          </span>
        </div>

        {/* Breath Oscillator Slider Track */}
        <div className="relative w-full h-3 sm:h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div className="absolute left-[36%] right-[36%] top-0 bottom-0 bg-emerald-500/45 border-x border-emerald-400" />
          <div
            className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-cyan-300 rounded-full shadow-[0_0_8px_#38bdf8] transition-all duration-75"
            style={{ left: `${breathMeter}%` }}
          />
        </div>

        {/* Touch Buttons */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-0.5">
          <button
            onClick={() => handleStroke('left')}
            className="py-3 px-2 rounded-xl bg-sky-700 hover:bg-sky-600 active:scale-95 active:bg-sky-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md flex flex-col items-center justify-center min-h-[48px]"
          >
            <span>{isLt ? 'KAIRĖ' : 'LEFT'}</span>
            <span className="text-[9px] text-sky-200 font-mono hidden sm:inline">(A / ◀)</span>
          </button>
          <button
            onClick={handleBreathSync}
            className="py-3 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 active:bg-emerald-400 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md flex flex-col items-center justify-center min-h-[48px]"
          >
            <span>{isLt ? 'ĮKVĖPIMAS' : 'BREATHE'}</span>
            <span className="text-[9px] text-emerald-200 font-mono hidden sm:inline">(SPACE)</span>
          </button>
          <button
            onClick={() => handleStroke('right')}
            className="py-3 px-2 rounded-xl bg-sky-700 hover:bg-sky-600 active:scale-95 active:bg-sky-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md flex flex-col items-center justify-center min-h-[48px]"
          >
            <span>{isLt ? 'DEŠINĖ' : 'RIGHT'}</span>
            <span className="text-[9px] text-sky-200 font-mono hidden sm:inline">(D / ▶)</span>
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {raceFinished && finalResult && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="max-w-sm w-full bg-slate-900 border border-sky-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-amber-300 mb-3 shadow-lg">
              <Trophy className="w-7 h-7" />
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white mb-1">
              {finalResult.won
                ? isLt ? 'Finišas: 1 Vieta!' : '1st Place Finish!'
                : isLt ? 'Plaukimas baigtas!' : 'Race Finished!'}
            </h2>
            <p className="text-xs text-sky-300 mb-4 leading-relaxed">
              {finalResult.won
                ? isLt ? 'Palietei sienelę pirma! Kauno tribūnos ploja atsistojusios!' : 'You touched first ahead of Dima!'
                : isLt ? 'Puikus sprintas baseine su Dima!' : 'Great lap sprint with Dima!'}
            </p>

            <div className="w-full grid grid-cols-2 gap-2 mb-4">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">{isLt ? 'Laikas' : 'Time'}</span>
                <span className="text-xl font-mono font-bold text-sky-200 tabular-nums">
                  {finalResult.time}s
                </span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">{isLt ? 'Medalis' : 'Rating'}</span>
                <span className="text-lg font-display font-bold text-amber-300">
                  {finalResult.rating}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onComplete({
                  timeSeconds: finalResult.time,
                  wonVsDima: finalResult.won,
                  score: finalResult.won ? 100 : 75,
                  perfectStrokes: sim.current.perfectStrokes,
                });
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 min-h-[46px]"
            >
              {isLt ? 'Tęsti istoriją' : 'Continue Story'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
