import React, { useState, useEffect } from 'react';
import {
  ScreenMode,
  PlayerStats,
  StoryNode,
  DialogueChoice,
  ChatThread,
  GameSaveState,
  Language,
} from './types';
import { STORY_NODES } from './data/storyNodes';
import { INITIAL_CHAT_THREADS } from './data/chatData';
import { sound } from './services/sound';
import { TitleScreen } from './components/TitleScreen';
import { VisualNovelDialog } from './components/VisualNovelDialog';
import { SwimmingMinigame } from './components/SwimmingMinigame';
import { PhoneModal } from './components/PhoneModal';
import { RosterScreen } from './components/RosterScreen';
import { EndingScreen } from './components/EndingScreen';

const SAVE_KEY = 'amelia_romance_game_save_v1';
const LANG_KEY = 'amelia_romance_game_lang_v1';

export default function App() {
  const [language, setLanguage] = useState<Language>('lt'); // Lithuanian default
  const [screenMode, setScreenMode] = useState<ScreenMode>('TITLE');
  const [currentNodeId, setCurrentNodeId] = useState<string>('mon_1');
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(INITIAL_CHAT_THREADS);
  const [hasSaveData, setHasSaveData] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const [stats, setStats] = useState<PlayerStats>({
    dimaAffection: 2,
    artemAffection: 2,
    romaAffection: 2,
    squadAffection: 3,
    swimmingSkill: 50,
    bestLapTime: 27.5,
    championshipWon: false,
  });

  const [activeMinigameDifficulty, setActiveMinigameDifficulty] = useState<
    'practice' | 'time_trial' | 'championship'
  >('practice');
  const [minigameNextNode, setMinigameNextNode] = useState<string | null>(null);

  // Check saved game and language on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANG_KEY);
      if (savedLang === 'lt' || savedLang === 'en') {
        setLanguage(savedLang);
      }
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        setHasSaveData(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next: Language = prev === 'lt' ? 'en' : 'lt';
      try {
        localStorage.setItem(LANG_KEY, next);
      } catch {
        // ignore
      }
      showToast(next === 'lt' ? 'Kalba pakeista į lietuvių 🇱🇹' : 'Language set to English 🇬🇧');
      return next;
    });
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast(null);
    }, 2500);
  };

  const handleSaveGame = () => {
    try {
      const stateToSave: GameSaveState = {
        currentNodeId,
        day: STORY_NODES[currentNodeId]?.day || 'MONDAY',
        period: STORY_NODES[currentNodeId]?.period || 'MORNING_SCHOOL',
        stats,
        readNodes: [],
        chatHistory: {},
        timestamp: Date.now(),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
      setHasSaveData(true);
      sound.playSfx('ding');
      showToast(language === 'lt' ? 'Žaidimo eiga sėkmingai išsaugota!' : 'Game progress saved successfully!');
    } catch {
      showToast(language === 'lt' ? 'Nepavyko išsaugoti žaidimo.' : 'Could not save progress.');
    }
  };

  const handleLoadGame = () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const parsed: GameSaveState = JSON.parse(raw);
      if (parsed.currentNodeId && STORY_NODES[parsed.currentNodeId]) {
        setCurrentNodeId(parsed.currentNodeId);
      }
      if (parsed.stats) {
        setStats(parsed.stats);
      }
      setScreenMode('STORY');
      sound.playSfx('ding');
      showToast(language === 'lt' ? 'Išsaugotas žaidimas įkeltas!' : 'Saved game restored!');
    } catch {
      showToast(language === 'lt' ? 'Nepavyko įkelti išsaugojimo.' : 'Failed to load save file.');
    }
  };

  const handleStartGame = () => {
    sound.playSfx('click');
    setCurrentNodeId('mon_1');
    setStats({
      dimaAffection: 2,
      artemAffection: 2,
      romaAffection: 2,
      squadAffection: 3,
      swimmingSkill: 50,
      bestLapTime: 27.5,
      championshipWon: false,
    });
    setScreenMode('STORY');
    sound.playBGM('school');
  };

  const handleAdvanceNode = (nextNodeId: string) => {
    const nextNode = STORY_NODES[nextNodeId];
    if (!nextNode) return;

    if (nextNode.triggerSwimMinigame) {
      setActiveMinigameDifficulty(nextNode.minigameDifficulty || 'practice');
      setMinigameNextNode(nextNode.nextNodeId || 'mon_evening_intro');
      setScreenMode('SWIMMING');
      sound.playBGM('pool');
      return;
    }

    if (nextNode.triggerEveningPhone) {
      setIsPhoneOpen(true);
    }

    if (nextNode.isEndingCheck) {
      setScreenMode('ENDING');
      return;
    }

    setCurrentNodeId(nextNodeId);

    if (nextNode.period === 'AFTERNOON_POOL') {
      sound.playBGM('pool');
    } else if (nextNode.period === 'EVENING_ROOM') {
      sound.playBGM('romantic');
    } else {
      sound.playBGM('school');
    }
  };

  const handleSelectChoice = (choice: DialogueChoice) => {
    setStats((prev) => ({
      ...prev,
      dimaAffection: prev.dimaAffection + (choice.dimaDelta || 0),
      artemAffection: prev.artemAffection + (choice.artemDelta || 0),
      romaAffection: prev.romaAffection + (choice.romaDelta || 0),
      squadAffection: prev.squadAffection + (choice.squadDelta || 0),
      swimmingSkill: prev.swimmingSkill + (choice.staminaDelta || 0),
    }));

    handleAdvanceNode(choice.nextNodeId);
  };

  const handleMinigameComplete = (results: {
    timeSeconds: number;
    wonVsDima: boolean;
    score: number;
  }) => {
    setStats((prev) => ({
      ...prev,
      bestLapTime: Math.min(prev.bestLapTime, results.timeSeconds),
      dimaAffection: prev.dimaAffection + (results.wonVsDima ? 2 : 1),
      swimmingSkill: prev.swimmingSkill + 5,
      championshipWon: activeMinigameDifficulty === 'championship' ? results.wonVsDima : prev.championshipWon,
    }));

    if (minigameNextNode) {
      setCurrentNodeId(minigameNextNode);
      setScreenMode('STORY');
      setMinigameNextNode(null);
    } else {
      setScreenMode('TITLE');
    }
  };

  const handleSendMessageOption = (
    threadId: string,
    playerText: string,
    replyText: string,
    deltas: { dima?: number; artem?: number; roma?: number }
  ) => {
    setStats((prev) => ({
      ...prev,
      dimaAffection: prev.dimaAffection + (deltas.dima || 0),
      artemAffection: prev.artemAffection + (deltas.artem || 0),
      romaAffection: prev.romaAffection + (deltas.roma || 0),
    }));

    setChatThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;

        const updatedMessages = [
          ...t.messages,
          {
            id: `msg_${Date.now()}_player`,
            senderId: 'player' as const,
            text: playerText,
            timestamp: language === 'lt' ? 'Ką tik' : 'Just now',
          },
          {
            id: `msg_${Date.now()}_reply`,
            senderId: threadId as any,
            text: replyText,
            timestamp: language === 'lt' ? 'Ką tik' : 'Just now',
          },
        ];

        return {
          ...t,
          messages: updatedMessages,
        };
      })
    );
  };

  const currentNode = STORY_NODES[currentNodeId] || STORY_NODES['mon_1'];

  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col relative font-sans">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-2xl shadow-xl animate-in fade-in duration-200">
          {saveToast}
        </div>
      )}

      {/* Main Screen Router */}
      {screenMode === 'TITLE' && (
        <TitleScreen
          language={language}
          onToggleLanguage={toggleLanguage}
          onStartGame={handleStartGame}
          onLoadGame={handleLoadGame}
          onOpenArcade={() => {
            setActiveMinigameDifficulty('practice');
            setMinigameNextNode(null);
            setScreenMode('SWIMMING');
            sound.playBGM('pool');
          }}
          onOpenRoster={() => setScreenMode('ROSTER')}
          onOpenPhone={() => setIsPhoneOpen(true)}
          hasSaveData={hasSaveData}
        />
      )}

      {screenMode === 'STORY' && (
        <VisualNovelDialog
          language={language}
          onToggleLanguage={toggleLanguage}
          currentNode={currentNode}
          stats={stats}
          onSelectChoice={handleSelectChoice}
          onAdvanceNode={handleAdvanceNode}
          onOpenPhone={() => setIsPhoneOpen(true)}
          onOpenArcade={() => {
            setActiveMinigameDifficulty('practice');
            setMinigameNextNode(currentNodeId);
            setScreenMode('SWIMMING');
            sound.playBGM('pool');
          }}
          onSaveGame={handleSaveGame}
          onLoadGame={handleLoadGame}
          hasSaveData={hasSaveData}
        />
      )}

      {screenMode === 'SWIMMING' && (
        <SwimmingMinigame
          language={language}
          difficulty={activeMinigameDifficulty}
          onComplete={handleMinigameComplete}
          onExit={() => {
            if (minigameNextNode) {
              setScreenMode('STORY');
            } else {
              setScreenMode('TITLE');
            }
          }}
        />
      )}

      {screenMode === 'ROSTER' && (
        <RosterScreen
          language={language}
          onToggleLanguage={toggleLanguage}
          onBack={() => setScreenMode('TITLE')}
          onOpenPhoneWithBoy={(boyId) => {
            setIsPhoneOpen(true);
          }}
        />
      )}

      {screenMode === 'ENDING' && (
        <EndingScreen
          language={language}
          stats={stats}
          onRestart={() => {
            setScreenMode('TITLE');
            sound.playBGM('romantic');
          }}
        />
      )}

      {/* Global Smartphone Overlay */}
      {isPhoneOpen && (
        <PhoneModal
          language={language}
          threads={chatThreads}
          onSendMessageOption={handleSendMessageOption}
          onClose={() => setIsPhoneOpen(false)}
        />
      )}
    </main>
  );
}
