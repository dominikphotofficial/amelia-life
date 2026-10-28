import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Waves, 
  HeartHandshake, 
  Timer, 
  Sparkles, 
  Coffee, 
  Moon, 
  Users, 
  Lock, 
  CheckCircle2, 
  X, 
  Award, 
  Flame, 
  Heart,
  TrendingUp
} from 'lucide-react';
import { Achievement, Language, PlayerStats } from '../types.ts';
import { ACHIEVEMENTS } from '../data/achievements.ts';
import { CHARACTERS } from '../data/characters.ts';

interface ProfileAchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  language: Language;
}

export const ProfileAchievementsModal: React.FC<ProfileAchievementsModalProps> = ({
  isOpen,
  onClose,
  stats,
  language,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  if (!isOpen) return null;

  const unlockedSet = new Set(stats.unlockedAchievements || []);
  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedSet.has(a.id)).length;
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    const isUnlocked = unlockedSet.has(ach.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: `w-5 h-5 ${isUnlocked ? 'text-amber-400' : 'text-stone-500'}` };
    switch (iconName) {
      case 'Waves':
        return <Waves {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'Timer':
        return <Timer {...props} />;
      case 'Trophy':
        return <Trophy {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Coffee':
        return <Coffee {...props} />;
      case 'Moon':
        return <Moon {...props} />;
      case 'Users':
        return <Users {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  const getProgress = (ach: Achievement) => {
    if (unlockedSet.has(ach.id)) return { current: ach.maxProgress || 1, max: ach.maxProgress || 1 };
    switch (ach.id) {
      case 'perfect_swim':
        return { current: Math.min(stats.perfectStrokesCount || 0, 5), max: 5 };
      case 'deep_conversations': {
        const maxVal = Math.max(stats.dimaAffection, stats.artemAffection, stats.romaAffection);
        return { current: Math.min(maxVal, 5), max: 5 };
      }
      case 'squad_love':
        return { current: Math.min(stats.squadAffection || 0, 5), max: 5 };
      default:
        return { current: 0, max: ach.maxProgress || 1 };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden text-stone-100"
        >
          {/* Header Banner */}
          <div className="relative p-5 pb-4 bg-gradient-to-br from-cyan-950/70 via-stone-900 to-amber-950/40 border-b border-stone-800 flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-800/80 text-stone-300 hover:text-white flex items-center justify-center border border-stone-700 hover:bg-stone-700 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              {/* Amelia portrait */}
              <div className="relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-lg shadow-cyan-900/40 bg-stone-800">
                <img
                  src={CHARACTERS.amelia.avatar}
                  alt="Amelia"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 bg-cyan-950/90 text-cyan-300 text-[10px] text-center font-bold py-0.5 tracking-wider">
                  KIG-2026
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-1">
                  <span>Kauno Tarptautinė Gimnazija</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Amelia
                  <span className="text-xs font-normal text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                    {language === 'lt' ? 'Elitinė plaukikė' : 'Elite Swimmer'}
                  </span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">
                  {language === 'lt'
                    ? '100m laisvuoju stiliumi rinktinės lyderė'
                    : '100m Freestyle National Hopeful'}
                </p>
              </div>
            </div>

            {/* Quick Athletic Stats Bar */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-stone-950/60 rounded-xl p-2.5 border border-stone-800 text-center">
                <div className="text-[10px] uppercase font-semibold text-stone-400">
                  {language === 'lt' ? 'Geriausias laikas' : 'Best Lap'}
                </div>
                <div className="text-sm font-bold text-cyan-400 flex items-center justify-center gap-1 mt-0.5">
                  <Timer className="w-3.5 h-3.5" />
                  {stats.bestLapTime > 0 && stats.bestLapTime < 999
                    ? `${stats.bestLapTime.toFixed(2)}s`
                    : '28.14s'}
                </div>
              </div>

              <div className="bg-stone-950/60 rounded-xl p-2.5 border border-stone-800 text-center">
                <div className="text-[10px] uppercase font-semibold text-stone-400">
                  {language === 'lt' ? 'Tobuli grybšniai' : 'Perfect Hits'}
                </div>
                <div className="text-sm font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-3.5 h-3.5" />
                  {stats.perfectStrokesCount || 0}
                </div>
              </div>

              <div className="bg-stone-950/60 rounded-xl p-2.5 border border-stone-800 text-center">
                <div className="text-[10px] uppercase font-semibold text-stone-400">
                  {language === 'lt' ? 'Pasiekimai' : 'Achievements'}
                </div>
                <div className="text-sm font-bold text-yellow-300 flex items-center justify-center gap-1 mt-0.5">
                  <Trophy className="w-3.5 h-3.5" />
                  {unlockedCount}/{totalAchievements}
                </div>
              </div>
            </div>
          </div>

          {/* Affection Quick View */}
          <div className="px-5 py-3 bg-stone-950/40 border-b border-stone-800/80 flex items-center justify-between gap-2 overflow-x-auto text-xs flex-shrink-0">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Heart className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span className="text-stone-300 font-medium">Dima:</span>
              <span className="font-bold text-cyan-300">{stats.dimaAffection}</span>
            </div>
            <div className="w-px h-3.5 bg-stone-800" />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-stone-300 font-medium">Artem:</span>
              <span className="font-bold text-amber-300">{stats.artemAffection}</span>
            </div>
            <div className="w-px h-3.5 bg-stone-800" />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
              <span className="text-stone-300 font-medium">Roma:</span>
              <span className="font-bold text-purple-300">{stats.romaAffection}</span>
            </div>
            <div className="w-px h-3.5 bg-stone-800" />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Users className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-stone-300 font-medium">{language === 'lt' ? 'Draugai:' : 'Squad:'}</span>
              <span className="font-bold text-pink-300">{stats.squadAffection || 0}</span>
            </div>
          </div>

          {/* Achievements Header & Filter Tabs */}
          <div className="px-5 pt-3 pb-2 flex-shrink-0 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                {language === 'lt' ? 'Trofėjai ir pasiekimai' : 'Trophies & Milestones'}
              </h4>
              <p className="text-[11px] text-stone-400">
                {language === 'lt'
                  ? `Užbaigta ${completionPercentage}% tikslų`
                  : `Completed ${completionPercentage}% of goals`}
              </p>
            </div>

            {/* Filter buttons */}
            <div className="inline-flex rounded-lg bg-stone-800/80 p-0.5 text-[11px] font-semibold border border-stone-700/60">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-md transition ${
                  filter === 'all' ? 'bg-amber-500 text-stone-950 font-bold shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                {language === 'lt' ? 'Visi' : 'All'}
              </button>
              <button
                onClick={() => setFilter('unlocked')}
                className={`px-2.5 py-1 rounded-md transition ${
                  filter === 'unlocked' ? 'bg-amber-500 text-stone-950 font-bold shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                {language === 'lt' ? 'Atrakinti' : 'Unlocked'}
              </button>
              <button
                onClick={() => setFilter('locked')}
                className={`px-2.5 py-1 rounded-md transition ${
                  filter === 'locked' ? 'bg-amber-500 text-stone-950 font-bold shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                {language === 'lt' ? 'Laukiantys' : 'Locked'}
              </button>
            </div>
          </div>

          {/* Achievements Scrollable List */}
          <div className="flex-1 overflow-y-auto px-5 py-2 space-y-2.5 overscroll-contain">
            {filteredAchievements.map((ach) => {
              const isUnlocked = unlockedSet.has(ach.id);
              const progress = getProgress(ach);

              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-r from-amber-950/30 to-stone-900/80 border-amber-500/40 shadow-sm shadow-amber-900/10'
                      : 'bg-stone-950/40 border-stone-800/70 opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon container */}
                    <div
                      className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-amber-500/20 to-amber-700/30 border-amber-400/50 shadow-inner shadow-amber-400/20'
                          : 'bg-stone-800 border-stone-700'
                      }`}
                    >
                      {isUnlocked ? getIcon(ach.icon, true) : <Lock className="w-5 h-5 text-stone-500" />}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5
                          className={`text-sm font-bold truncate ${
                            isUnlocked ? 'text-amber-200' : 'text-stone-300'
                          }`}
                        >
                          {language === 'lt' ? ach.titleLt : ach.title}
                        </h5>

                        {isUnlocked ? (
                          <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                            <CheckCircle2 className="w-3 h-3 text-amber-400" />
                            {language === 'lt' ? 'Atrakinta' : 'Unlocked'}
                          </span>
                        ) : (
                          <span className="flex-shrink-0 text-[10px] font-semibold text-stone-500">
                            {progress.current}/{progress.max}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-400 mt-1 leading-snug">
                        {language === 'lt' ? ach.descriptionLt : ach.description}
                      </p>

                      {/* Progress bar if not unlocked */}
                      {!isUnlocked && progress.max > 1 && (
                        <div className="mt-2.5">
                          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${(progress.current / progress.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAchievements.length === 0 && (
              <div className="py-8 text-center text-stone-500 text-xs">
                {language === 'lt' ? 'Pagal šį filtrą pasiekimų nėra.' : 'No achievements under this filter.'}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-stone-950 border-t border-stone-800 text-center flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-stone-800 to-stone-700 hover:from-stone-700 hover:to-stone-600 text-stone-200 font-semibold text-xs tracking-wider uppercase transition shadow active:scale-[0.98]"
            >
              {language === 'lt' ? 'Uždaryti profilį' : 'Close Profile'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
