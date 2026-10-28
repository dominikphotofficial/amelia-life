import React, { useState, useEffect } from 'react';
import { StoryNode, DialogueChoice, PlayerStats, Language } from '../types';
import { CHARACTERS } from '../data/characters';
import { sound } from '../services/sound';
import {
  Heart,
  Smartphone,
  BookOpen,
  Volume2,
  VolumeX,
  Globe,
  Bookmark,
  MapPin,
  Calendar,
  Waves,
  Trophy,
} from 'lucide-react';
import { ProfileAchievementsModal } from './ProfileAchievementsModal.tsx';

interface VisualNovelDialogProps {
  language: Language;
  onToggleLanguage: () => void;
  currentNode: StoryNode;
  stats: PlayerStats;
  onSelectChoice: (choice: DialogueChoice) => void;
  onAdvanceNode: (nextNodeId: string) => void;
  onOpenPhone: () => void;
  onOpenArcade: () => void;
  onSaveGame: () => void;
  onLoadGame: () => void;
  hasSaveData: boolean;
}

export const VisualNovelDialog: React.FC<VisualNovelDialogProps> = ({
  language,
  onToggleLanguage,
  currentNode,
  stats,
  onSelectChoice,
  onAdvanceNode,
  onOpenPhone,
  onOpenArcade,
  onSaveGame,
  onLoadGame,
  hasSaveData,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [historyLog, setHistoryLog] = useState<{ speaker: string; text: string }[]>([]);
  const [muted, setMuted] = useState(sound.getMuted());
  const [choiceReaction, setChoiceReaction] = useState<string | null>(null);

  const isLt = language === 'lt';
  const speaker = CHARACTERS[currentNode.speakerId] || CHARACTERS.narrator;

  const currentText = isLt && currentNode.textLt ? currentNode.textLt : currentNode.text;
  const currentChapter = isLt && currentNode.chapterTitleLt ? currentNode.chapterTitleLt : currentNode.chapterTitle;
  const currentLocation = isLt && currentNode.locationNameLt ? currentNode.locationNameLt : currentNode.locationName;
  const currentSpeakerRole = isLt && speaker.roleLt ? speaker.roleLt : speaker.role;

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);
    setChoiceReaction(null);

    const fullText = currentText;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index % 4 === 0) {
        sound.playSfx('text');
      }
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 18);

    setHistoryLog((prev) => [
      ...prev,
      { speaker: speaker.name, text: fullText },
    ]);

    return () => clearInterval(interval);
  }, [currentNode.id, language]);

  const handleBoxClick = () => {
    if (isTyping) {
      setDisplayedText(currentText);
      setIsTyping(false);
    } else if (!currentNode.choices || currentNode.choices.length === 0) {
      if (currentNode.nextNodeId) {
        sound.playSfx('click');
        onAdvanceNode(currentNode.nextNodeId);
      }
    }
  };

  const handleChoice = (c: DialogueChoice) => {
    sound.playSfx('click');
    if (c.dimaDelta || c.artemDelta || c.romaDelta) {
      sound.playSfx('heart');
    }
    const reaction = isLt && c.reactionTextLt ? c.reactionTextLt : c.reactionText;
    if (reaction) {
      setChoiceReaction(reaction);
      setTimeout(() => {
        onSelectChoice(c);
      }, 900);
    } else {
      onSelectChoice(c);
    }
  };

  const dayTranslations: Record<string, string> = {
    MONDAY: 'PIRMADIENIS',
    TUESDAY: 'ANTRADIENIS',
    WEDNESDAY: 'TREČIADIENIS',
    THURSDAY: 'KETVIRTADIENIS',
    FRIDAY: 'PENKTADIENIS',
  };

  const periodTranslations: Record<string, string> = {
    MORNING_SCHOOL: 'Rytas',
    AFTERNOON_POOL: 'Baseinas',
    EVENING_ROOM: 'Vakaras',
  };

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between overflow-hidden select-none bg-slate-950 font-sans pb-[env(safe-area-inset-bottom)]">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={currentNode.bgImage || CHARACTERS.amelia.avatar}
          alt="Scene Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top sm:object-center brightness-[0.65] filter blur-[0.5px] scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
      </div>

      {/* Top HUD: Compact & Touch-Friendly for Mobile */}
      <header className="relative z-20 flex items-center justify-between p-2.5 sm:p-4 max-w-7xl mx-auto w-full gap-2 shrink-0">
        {/* Left: Location & Day badge */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-md text-[11px] sm:text-xs font-semibold text-slate-200 shrink-0">
            <Calendar className="w-3 h-3 text-sky-400" />
            <span>{isLt ? dayTranslations[currentNode.day]?.slice(0, 4) : currentNode.day.slice(0, 3)}</span>
            <span className="text-slate-500">·</span>
            <span className="text-sky-300">
              {isLt ? periodTranslations[currentNode.period] : currentNode.period.split('_')[0]}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-md text-xs font-medium text-slate-300 truncate">
            <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="truncate max-w-[200px]">{currentLocation}</span>
          </div>
        </div>

        {/* Center: Mobile compact affection meters (Clickable to open profile) */}
        <button
          onClick={() => {
            sound.playSfx('click');
            setShowProfile(true);
          }}
          className="flex items-center gap-1.5 sm:gap-3 bg-slate-900/85 hover:bg-slate-850 active:scale-95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-slate-700/80 shadow-md text-[10px] sm:text-xs shrink-0 transition"
          title={isLt ? 'Atidaryti Amelijos profilį' : 'Open Amelia Profile'}
        >
          <span className="text-cyan-400 font-bold">D:{stats.dimaAffection}</span>
          <span className="text-slate-600">·</span>
          <span className="text-amber-400 font-bold">A:{stats.artemAffection}</span>
          <span className="text-slate-600">·</span>
          <span className="text-violet-400 font-bold">R:{stats.romaAffection}</span>
        </button>

        {/* Right Action Island: Profile, Phone, Sound, Log, Language */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              sound.playSfx('click');
              setShowProfile(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-md text-xs font-bold transition active:scale-95"
            title={isLt ? 'Profilis ir Pasiekimai' : 'Profile & Achievements'}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-300">
              {stats.unlockedAchievements?.length || 0}
            </span>
          </button>

          <button
            onClick={onOpenPhone}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-600/90 active:scale-95 text-white shadow-md text-xs font-bold transition-all animate-pulse"
            title="Telefonas / Phone"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          </button>

          <button
            onClick={() => {
              sound.playSfx('click');
              onToggleLanguage();
            }}
            className="px-2 py-1.5 rounded-xl bg-slate-900/80 text-sky-300 border border-slate-700 text-xs font-bold"
            title="Kalba / Language"
          >
            <Globe className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="p-1.5 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-700"
            title="Archyvas / Log"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onSaveGame}
            className="p-1.5 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-700"
            title="Išsaugoti / Save"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              const isNowMuted = sound.toggleMute();
              setMuted(isNowMuted);
            }}
            className="p-1.5 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-700"
            title="Garsas"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Center Field: Character Sprite Display (Optimized for Mobile Height) */}
      <div className="relative z-10 flex-1 flex items-end justify-center pointer-events-none pb-1 sm:pb-3 overflow-hidden">
        {currentNode.activeCharacterImage && (
          <div className="relative max-w-[280px] sm:max-w-md w-full h-[32vh] sm:h-[45vh] flex items-end justify-center animate-in fade-in slide-in-from-bottom-6 duration-300">
            <img
              src={currentNode.activeCharacterImage}
              alt={speaker.name}
              referrerPolicy="no-referrer"
              className="max-h-full w-auto object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] filter contrast-105"
            />
          </div>
        )}
      </div>

      {/* Choice Reaction Toast */}
      {choiceReaction && (
        <div className="relative z-30 self-center mb-1.5 px-3.5 py-1.5 bg-slate-900/95 border border-pink-500/50 rounded-2xl text-pink-300 text-xs font-semibold shadow-xl flex items-center gap-1.5 animate-bounce">
          <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
          <span className="truncate max-w-[280px]">{choiceReaction}</span>
        </div>
      )}

      {/* Bottom Area: Dialogue Box & Choices */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-6 pb-3 sm:pb-5 pt-1">
        {/* Branching Dialogue Choices */}
        {currentNode.choices && currentNode.choices.length > 0 && !isTyping && (
          <div className="mb-2 space-y-1.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {currentNode.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className="w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/95 hover:bg-sky-950/90 active:bg-sky-900 border border-sky-500/40 text-white text-xs sm:text-sm font-medium transition-all shadow-lg flex items-center justify-between group min-h-[44px]"
              >
                <span className="flex-1 pr-2.5 leading-snug">
                  {isLt && choice.textLt ? choice.textLt : choice.text}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 text-[10px] font-bold tracking-wider shrink-0">
                  {isLt ? 'RINKTIS' : 'CHOOSE'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Visual Novel Text Box */}
        <div
          onClick={handleBoxClick}
          className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl cursor-pointer hover:border-sky-500/40 transition-colors"
        >
          {/* Speaker Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-display font-extrabold text-white bg-gradient-to-r ${speaker.themeColor} shadow-md`}
              >
                {speaker.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">
                {currentSpeakerRole}
              </span>
            </div>

            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              {isLt ? '[Spauskite toliau]' : '[Click to advance]'}
            </span>
          </div>

          {/* Dialogue Body Text */}
          <p className="text-slate-100 text-xs sm:text-sm md:text-base leading-relaxed min-h-[48px] select-none font-normal">
            {displayedText}
            {isTyping && <span className="inline-block w-1.5 h-3.5 bg-sky-400 ml-1 animate-pulse" />}
          </p>

          {/* Next Indicator */}
          {!isTyping && (!currentNode.choices || currentNode.choices.length === 0) && (
            <div className="absolute right-4 bottom-3 text-sky-400 animate-bounce">
              <span className="text-[10px] font-bold tracking-widest uppercase">
                {isLt ? '▶ TOLIAU' : '▶ NEXT'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Backlog / Dialogue History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                {isLt ? 'Dialogų archyvas' : 'Dialogue Backlog'}
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                {isLt ? 'Uždaryti' : 'Close'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {historyLog.map((log, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-xs font-bold text-sky-400">{log.speaker}</span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                    {log.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Amelia Profile & Achievements Modal */}
      <ProfileAchievementsModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        stats={stats}
        language={language}
      />
    </div>
  );
};
