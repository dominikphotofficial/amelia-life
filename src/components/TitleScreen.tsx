import React, { useEffect } from 'react';
import { Language } from '../types';
import { CHARACTER_IMAGES } from '../data/characters';
import { sound } from '../services/sound';
import { Play, RotateCcw, Waves, Users, Smartphone, Volume2, VolumeX, Globe, Sparkles } from 'lucide-react';

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
    <div className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between overflow-y-auto overflow-x-hidden select-none bg-slate-950 font-sans">
      {/* Background Hero Visual with European Amelia Portrait & Pool Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={CHARACTER_IMAGES.ameliaPortrait}
          alt="Amelia"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top sm:object-center brightness-[0.45] sm:brightness-[0.6] filter blur-[0.5px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* Top Header: Responsive for Phone & Desktop */}
      <header className="relative z-10 flex items-center justify-between p-3.5 sm:p-6 max-w-7xl mx-auto w-full shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-sky-500/30 text-[11px] sm:text-xs font-semibold text-sky-200">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-none">
            {isLt ? 'Kauno tarptautinė gimnazija' : 'Kaunas International Gymnasium'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle Button */}
          <button
            onClick={() => {
              sound.playSfx('click');
              onToggleLanguage();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-sky-500/30 transition-colors shadow-lg text-xs font-bold"
            title="Pakeisti kalbą / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isLt ? 'LT' : 'EN'}</span>
          </button>

          <button
            onClick={() => {
              const isNowMuted = sound.toggleMute();
              setMuted(isNowMuted);
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-300 border border-sky-500/30 transition-colors shadow-lg"
            title="Garsas / Audio"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Centerpiece: Responsive Mobile-First Typography Lockup */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-12 max-w-4xl mx-auto w-full my-auto py-4">
        {/* Amelia Portrait Badge on Mobile */}
        <div className="flex items-center gap-3.5 mb-3 sm:hidden">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-sky-400/60 shadow-lg shadow-sky-500/20 shrink-0 bg-slate-800">
            <img
              src={CHARACTER_IMAGES.ameliaPortrait}
              alt="Amelija"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
              {isLt ? 'Plaukimo čempionė' : 'Pro Swimmer'}
            </span>
            <h3 className="text-base font-extrabold text-white">Amelija · Kaunas</h3>
          </div>
        </div>

        {/* Title Lockup */}
        <div className="mb-3 sm:mb-6">
          <div className="inline-block">
            <span className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-rose-400 drop-shadow-xl block leading-tight">
              AMELIJA
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 sm:mt-2">
            <div className="h-0.5 w-8 sm:w-12 bg-sky-400 rounded-full" />
            <h2 className="text-lg sm:text-2xl md:text-3xl font-display font-extrabold text-white tracking-wide uppercase drop-shadow">
              {isLt ? 'Širdis gilioje gelmėje' : 'Heart in the Deep End'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1 tracking-wider uppercase">
            DIMA · ARTIOMAS · ROMA · KAUNO KOMANDA
          </p>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed mb-5 sm:mb-8 font-light drop-shadow">
          {isLt ? (
            <>
              Pasinerkite į Amelijos gyvenimą: talentingos Kauno plaukikės, atstovaujančios{' '}
              <strong className="text-white font-medium">Kauno tarptautinei gimnazijai</strong>.
              Baseine treniruokitės su <strong className="text-cyan-300 font-medium">Dima</strong>,
              koridoriuose dalinkitės šypsenomis su <strong className="text-amber-300 font-medium">Artiomu</strong> ir
              vėlų vakarą susirašinėkite su <strong className="text-violet-300 font-medium">Roma</strong>!
            </>
          ) : (
            <>
              Experience the intense high-school life of Amelia: star swimmer representing{' '}
              <strong className="text-white font-medium">Kaunas International Gymnasium</strong>.
              Train in the pool with <strong className="text-cyan-300 font-medium">Dima</strong>, share
              hallway moments with <strong className="text-amber-300 font-medium">Artem</strong>,
              and chat across borders with <strong className="text-violet-300 font-medium">Roma</strong> from Russia!
            </>
          )}
        </p>

        {/* Primary Start CTA & Mobile-Optimized Grid */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3.5 mb-3">
          <button
            onClick={onStartGame}
            className="w-full sm:w-auto py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-95 text-white font-display font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-sky-600/30 transition-all flex items-center justify-center gap-2.5 min-h-[48px]"
          >
            <Play className="w-5 h-5 fill-white shrink-0" />
            <span>{isLt ? 'PRADĖTI ISTORIJĄ' : 'START STORY'}</span>
          </button>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            {hasSaveData && (
              <button
                onClick={onLoadGame}
                className="py-3 px-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-slate-200 border border-slate-700/80 font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{isLt ? 'Tęsti' : 'Continue'}</span>
              </button>
            )}

            <button
              onClick={onOpenArcade}
              className="py-3 px-3.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 active:scale-95 text-cyan-200 border border-cyan-500/40 font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Waves className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{isLt ? 'Baseinas' : 'Swim Arcade'}</span>
            </button>

            <button
              onClick={onOpenRoster}
              className="py-3 px-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 active:scale-95 text-slate-300 border border-slate-700 font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Users className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{isLt ? 'Veikėjai' : 'Characters'}</span>
            </button>

            <button
              onClick={onOpenPhone}
              className="py-3 px-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 active:scale-95 text-slate-300 border border-slate-700 font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{isLt ? 'Telefonas' : 'Phone'}</span>
            </button>
          </div>
        </div>

        {/* Flat Control-Hint Line */}
        <p className="text-slate-400 text-[11px] sm:text-xs font-mono tracking-wide mt-1">
          {isLt
            ? '[ENTER] Pradėti · [A/D] Grybšniai · [SPACE] Įkvėpimas'
            : '[ENTER] Start · [A/D] Stroke · [SPACE] Breathe'}
        </p>
      </div>

      {/* Bottom Footer: Mobile-adapted */}
      <footer className="relative z-10 px-4 py-3 sm:py-4 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 max-w-7xl mx-auto w-full border-t border-slate-900 shrink-0">
        <span className="truncate pr-2">
          {isLt
            ? 'Kauno tarptautinė gimnazija · Baltijos jaunimo čempionatas'
            : 'Kaunas International Gymnasium Athletics'}
        </span>
        <span className="font-mono shrink-0">🇱🇹 Lietuva</span>
      </footer>
    </div>
  );
};
