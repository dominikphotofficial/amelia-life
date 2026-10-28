import React, { useEffect } from 'react';
import { Language } from '../types';
import { CHARACTER_IMAGES } from '../data/characters';
import { sound } from '../services/sound';
import { Play, RotateCcw, Waves, Users, Smartphone, Volume2, VolumeX, Globe } from 'lucide-react';

interface TitleScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onStartGame: () => void;
  onLoadGame: () => void;
  onOpenArcade: () => void;
  onOpenRoster: () => void;
  onOpenPhone: () => void;
  hasSaveData: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  language,
  onToggleLanguage,
  onStartGame,
  onLoadGame,
  onOpenArcade,
  onOpenRoster,
  onOpenPhone,
  hasSaveData,
}) => {
  const [muted, setMuted] = React.useState(sound.getMuted());
  const isLt = language === 'lt';

  useEffect(() => {
    sound.playBGM('romantic');
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-slate-950 font-sans">
      {/* Background Hero Visual with Slow Ambient Pan */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={CHARACTER_IMAGES.ameliaHero}
          alt="Amelia at Pool"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 animate-pulse duration-[8000ms] brightness-[0.7] filter"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />
      </div>

      {/* Top Header: Language switcher and Audio button */}
      <header className="relative z-10 flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-sky-500/30 text-xs font-semibold text-sky-200">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>
            {isLt
              ? 'Kauno tarptautinė gimnazija · Plaukimo romantinė novelė'
              : 'Kaunas International Gymnasium · Aquatic Sports Romance'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Toggle Button */}
          <button
            onClick={() => {
              sound.playSfx('click');
              onToggleLanguage();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-sky-500/30 transition-colors shadow-lg text-xs font-bold"
            title="Pakeisti kalbą / Switch Language"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{isLt ? '🇱🇹 Lietuvių k.' : '🇬🇧 English'}</span>
          </button>

          <button
            onClick={() => {
              const isNowMuted = sound.toggleMute();
              setMuted(isNowMuted);
            }}
            className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-sky-500/30 transition-colors shadow-lg"
            title="Toggle BGM & SFX"
          >
            {muted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </header>

      {/* Centerpiece: Bespoke SVG Title Lockup with 30-40% Negative Space */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 max-w-4xl">
        <div className="mb-6">
          <svg viewBox="0 0 700 130" className="w-full max-w-xl h-auto drop-shadow-2xl">
            <defs>
              <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            <text
              x="10"
              y="60"
              fill="url(#titleGrad)"
              fontSize="56"
              fontWeight="900"
              fontFamily="Outfit, sans-serif"
              letterSpacing="2"
            >
              AMELIJA
            </text>

            <path
              d="M 245 45 Q 330 20, 430 50 T 630 40"
              fill="none"
              stroke="url(#waveGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />

            <text
              x="250"
              y="85"
              fill="#ffffff"
              fontSize="30"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
              letterSpacing="3"
            >
              {isLt ? 'ŠIRDIS GILIOJE GELMĖJE' : 'HEART IN THE DEEP END'}
            </text>

            <text
              x="12"
              y="115"
              fill="#94a3b8"
              fontSize="14"
              fontWeight="600"
              fontFamily="Plus Jakarta Sans, sans-serif"
              letterSpacing="1.5"
            >
              DIMA · ARTIOMAS · ROMA · KAUNO KOMANDA
            </text>
          </svg>
        </div>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed mb-8 font-light drop-shadow">
          {isLt ? (
            <>
              Pasinerkite į Amelijos gyvenimą: talentingos plaukikės, atstovaujančios{' '}
              <strong className="text-white font-medium">Kauno tarptautinei gimnazijai</strong>.
              Treniruokitės baseine su <strong className="text-cyan-300 font-medium">Dima</strong>, dalinkitės
              šypsenomis koridoriuose su <strong className="text-amber-300 font-medium">Artiomu</strong> ir
              susirašinėkite vėlų vakarą su <strong className="text-violet-300 font-medium">Roma</strong> iš Rusijos!
            </>
          ) : (
            <>
              Experience the intense high-school life of Amelia: star swimmer representing{' '}
              <strong className="text-white font-medium">Kaunas International Gymnasium</strong>.
              Train in the pool with <strong className="text-cyan-300 font-medium">Dima</strong>, share
              sweet hallway moments with <strong className="text-amber-300 font-medium">Artem</strong>,
              and chat across borders with <strong className="text-violet-300 font-medium">Roma</strong> from Russia!
            </>
          )}
        </p>

        {/* Primary Start CTA & Menu Action Island */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
          <button
            onClick={onStartGame}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-display font-extrabold text-base tracking-wide shadow-xl shadow-sky-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{isLt ? 'PRADĖTI ISTORIJĄ' : 'START STORY'}</span>
          </button>

          {hasSaveData && (
            <button
              onClick={onLoadGame}
              className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all shadow-md flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-sky-400" />
              <span>{isLt ? 'Tęsti žaidimą' : 'Continue Save'}</span>
            </button>
          )}

          <button
            onClick={onOpenArcade}
            className="px-5 py-4 rounded-2xl bg-cyan-950/70 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/40 font-semibold text-sm transition-all shadow-md flex items-center gap-2"
          >
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>{isLt ? 'Baseino arkada' : 'Swim Arcade'}</span>
          </button>

          <button
            onClick={onOpenRoster}
            className="px-5 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-sm transition-all shadow-md flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-rose-400" />
            <span>{isLt ? 'Veikėjai ir draugai' : 'Characters & Friends'}</span>
          </button>

          <button
            onClick={onOpenPhone}
            className="px-5 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-sm transition-all shadow-md flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>{isLt ? 'Amelijos telefonas' : 'Amelia’s Phone'}</span>
          </button>
        </div>

        {/* Single Flat Control-Hint Line */}
        <p className="text-slate-400 text-xs font-mono tracking-wide">
          {isLt
            ? '[ENTER] Pradėti · [A/D] Grybšniai kairė/dešinė · [SPACE] Įkvėpimas · [KLIK] Dialogas'
            : '[ENTER] Start · [A/D] Stroke · [SPACE] Breathe · [CLICK] Advance Dialogue'}
        </p>
      </div>

      {/* Bottom Footer: Minimalist copyright & credits */}
      <footer className="relative z-10 p-6 flex items-center justify-between text-xs text-slate-500 max-w-7xl mx-auto w-full border-t border-slate-900">
        <span>
          {isLt
            ? 'Kauno tarptautinė gimnazija · Baltijos šalių jaunimo plaukimo čempionatas'
            : 'Kaunas International Gymnasium Athletics · Baltic Junior Championship'}
        </span>
        <span className="font-mono">v1.1 · Lietuvių kalba 🇱🇹</span>
      </footer>
    </div>
  );
};
