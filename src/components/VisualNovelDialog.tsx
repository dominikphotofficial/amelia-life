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
} from 'lucide-react';

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
  const [historyLog, setHistoryLog] = useState<{ speaker: string; text: string }[]>([]);
  const [muted, setMuted] = useState(sound.getMuted());
  const [choiceReaction, setChoiceReaction] = useState<string | null>(null);

  const isLt = language === 'lt';
  const speaker = CHARACTERS[currentNode.speakerId] || CHARACTERS.narrator;

  const currentText = isLt && currentNode.textLt ? currentNode.textLt : currentNode.text;
  const currentChapter = isLt && currentNode.chapterTitleLt ? currentNode.chapterTitleLt : currentNode.chapterTitle;
  const currentLocation = isLt && currentNode.locationNameLt ? currentNode.locationNameLt : currentNode.locationName;
  const currentSpeakerRole = isLt && speaker.roleLt ? speaker.roleLt : speaker.role;

  // Typewriter effect
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
      }, 1000);
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
    MORNING_SCHOOL: 'Rytas · Gimnazija',
    AFTERNOON_POOL: 'Popietė · Baseinas',
    EVENING_ROOM: 'Vakaras · Namai',
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none bg-slate-950 font-sans">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentNode.bgImage || CHARACTERS.amelia.avatar}
          alt="Scene Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-[0.72] filter blur-[0.5px] scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
      </div>

      {/* Top HUD: Status Bar, Location, Stats & Controls */}
      <header className="relative z-20 flex items-center justify-between p-3 sm:p-5 max-w-7xl mx-auto w-full">
        {/* Left: Location & Day */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-md text-xs font-semibold text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>{isLt ? dayTranslations[currentNode.day] || currentNode.day : currentNode.day}</span>
            <span className="text-slate-500">·</span>
            <span className="text-sky-300">
              {isLt
                ? periodTranslations[currentNode.period] || currentNode.period
                : currentNode.period.replace('_', ' ').toLowerCase()}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-md text-xs font-medium text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span className="truncate max-w-[260px]">{currentLocation}</span>
          </div>
        </div>

        {/* Center: Romance Affection Meters */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-slate-700/80 shadow-md">
          {/* Dima */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-cyan-400 font-semibold">Dima:</span>
            <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${Math.min(100, stats.dimaAffection * 10)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-cyan-300 tabular-nums">
              {stats.dimaAffection}
            </span>
          </div>

          <span className="text-slate-600">|</span>

          {/* Artem */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-amber-400 font-semibold">{isLt ? 'Artiomas' : 'Artem'}:</span>
            <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: `${Math.min(100, stats.artemAffection * 10)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-amber-300 tabular-nums">
              {stats.artemAffection}
            </span>
          </div>

          <span className="text-slate-600">|</span>

          {/* Roma */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-violet-400 font-semibold">Roma:</span>
            <div className="w-14 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-400 transition-all duration-500"
                style={{ width: `${Math.min(100, stats.romaAffection * 10)}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-violet-300 tabular-nums">
              {stats.romaAffection}
            </span>
          </div>
        </div>

        {/* Right Action Island: Language, Phone, Pool, Log, Save, Sound */}
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <button
            onClick={() => {
              sound.playSfx('click');
              onToggleLanguage();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-semibold transition-all"
            title="Pakeisti kalbą / Change Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isLt ? 'LT' : 'EN'}</span>
          </button>

          {/* Open Phone Button */}
          <button
            onClick={onOpenPhone}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600/90 hover:bg-sky-500 text-white shadow-md text-xs font-bold transition-all animate-pulse"
            title={isLt ? 'Atidaryti Amelijos telefoną' : 'Open Amelia’s Smartphone'}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLt ? 'Telefonas' : 'Phone'}</span>
            <span className="w-2 h-2 rounded-full bg-rose-400" />
          </button>

          {/* Swim minigame jump */}
          <button
            onClick={onOpenArcade}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
            title={isLt ? 'Baseino treniruotė' : 'Launch Swimming Practice'}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>{isLt ? 'Baseinas' : 'Pool'}</span>
          </button>

          {/* Log History */}
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            title={isLt ? 'Dialogų archyvas' : 'Dialogue Log'}
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Quick Save */}
          <button
            onClick={onSaveGame}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            title={isLt ? 'Greitas išsaugojimas' : 'Quick Save'}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              const isNowMuted = sound.toggleMute();
              setMuted(isNowMuted);
            }}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            title="Garsas / Sound"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Center Field: Character Sprite Display */}
      <div className="relative z-10 flex-1 flex items-end justify-center pointer-events-none pb-2 sm:pb-4">
        {currentNode.activeCharacterImage && (
          <div className="relative max-w-sm sm:max-w-md w-full h-[380px] sm:h-[480px] flex items-end justify-center animate-in fade-in slide-in-from-bottom-8 duration-300">
            <img
              src={currentNode.activeCharacterImage}
              alt={speaker.name}
              referrerPolicy="no-referrer"
              className="max-h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] filter contrast-105"
            />
          </div>
        )}
      </div>

      {/* Choice Reaction Toast */}
      {choiceReaction && (
        <div className="relative z-30 self-center mb-2 px-4 py-2 bg-slate-900/90 border border-pink-500/40 rounded-2xl text-pink-300 text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2 animate-bounce">
          <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
          <span>{choiceReaction}</span>
        </div>
      )}

      {/* Dialogue Box & Interactive Choices */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 pb-6 pt-2">
        {/* Branching Dialogue Choices (if any) */}
        {currentNode.choices && currentNode.choices.length > 0 && !isTyping && (
          <div className="mb-3 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {currentNode.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-slate-900/95 hover:bg-sky-950/80 active:bg-sky-900 border border-sky-500/40 hover:border-sky-400 text-white text-xs sm:text-sm font-medium transition-all shadow-xl hover:shadow-sky-500/20 flex items-center justify-between group"
              >
                <span className="flex-1 pr-3 leading-relaxed">
                  {isLt && choice.textLt ? choice.textLt : choice.text}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-sky-500/20 text-sky-300 text-[11px] font-bold tracking-wider shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  {isLt ? 'PASIRINKTI' : 'CHOOSE'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Visual Novel Text Box */}
        <div
          onClick={handleBoxClick}
          className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl cursor-pointer hover:border-sky-500/40 transition-colors"
        >
          {/* Speaker Badge */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-display font-extrabold text-white bg-gradient-to-r ${speaker.themeColor} shadow-md`}
              >
                {speaker.name}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {currentSpeakerRole}
              </span>
            </div>

            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              {isLt ? '[Spauskite arba Space toliau]' : '[Click or Space to continue]'}
            </span>
          </div>

          {/* Dialogue Body Text */}
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed min-h-[56px] select-none font-normal">
            {displayedText}
            {isTyping && <span className="inline-block w-1.5 h-4 bg-sky-400 ml-1 animate-pulse" />}
          </p>

          {/* Next Indicator */}
          {!isTyping && (!currentNode.choices || currentNode.choices.length === 0) && (
            <div className="absolute right-5 bottom-4 text-sky-400 animate-bounce">
              <span className="text-xs font-bold tracking-widest uppercase">
                {isLt ? '▶ TOLIAU' : '▶ NEXT'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Backlog / Dialogue History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
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

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {historyLog.map((log, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-xs font-bold text-sky-400">{log.speaker}</span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-2xl border border-slate-700/40">
                    {log.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
