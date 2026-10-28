import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles, X } from 'lucide-react';
import { Achievement, Language } from '../types.ts';

interface AchievementToastProps {
  achievement: Achievement | null;
  language: Language;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  language,
  onDismiss,
}) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 380, damping: 25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-sm pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/90 via-stone-900/95 to-amber-900/90 border border-amber-400/50 shadow-[0_12px_40px_rgba(245,158,11,0.35)] backdrop-blur-md p-3.5 text-white flex items-center gap-3">
            {/* Shimmer sweep animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />

            {/* Glowing Trophy Icon */}
            <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 text-stone-950 font-black">
              <Trophy className="w-6 h-6 fill-stone-950 text-stone-950 animate-bounce" />
              <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-yellow-200 fill-yellow-200 animate-spin" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {language === 'lt' ? 'Pasiekimas atrakintas!' : 'Achievement Unlocked!'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-amber-100 truncate mt-0.5">
                {language === 'lt' ? achievement.titleLt : achievement.title}
              </h4>
              <p className="text-xs text-amber-200/80 line-clamp-1 leading-snug">
                {language === 'lt' ? achievement.descriptionLt : achievement.description}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onDismiss}
              className="p-1 rounded-full text-amber-300/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
