import { Achievement, PlayerStats } from '../types.ts';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'perfect_swim',
    title: 'Perfect Swim',
    titleLt: 'Tobulas plaukimas',
    description: 'Hit 5 or more perfect rhythm strokes during swimming practice or championship.',
    descriptionLt: 'Atlik bent 5 nepriekaištingus ritmo grybšnius baseine treniruotės ar čempionato metu.',
    icon: 'Waves',
    category: 'swimming',
    unlocked: false,
    maxProgress: 5,
  },
  {
    id: 'deep_conversations',
    title: 'Deep Conversations',
    titleLt: 'Gilus ryšys',
    description: 'Forge a deep emotional connection with Dima, Artem, or Roma (5+ affection).',
    descriptionLt: 'Užmegzk gilų emocinį ryšį su Dima, Artemu arba Roma (5+ prielankumo taškai).',
    icon: 'HeartHandshake',
    category: 'romance',
    unlocked: false,
    maxProgress: 5,
  },
  {
    id: 'first_finish',
    title: 'First Lap',
    titleLt: 'Pirmasis finišas',
    description: 'Complete Amelia\'s first demanding lane training in the Kaunas Olympic pool.',
    descriptionLt: 'Užbaik pirmąją intensyvią treniruotę Kauno baseino takelyje.',
    icon: 'Timer',
    category: 'swimming',
    unlocked: false,
    maxProgress: 1,
  },
  {
    id: 'gold_medalist',
    title: 'Baltic Champion',
    titleLt: 'Baltijos čempionė',
    description: 'Win the 100m freestyle gold medal at the Baltic Youth Championship.',
    descriptionLt: 'Iškovok aukso medalį 100 m laisvuoju stiliumi Baltijos jaunimo čempionate.',
    icon: 'Trophy',
    category: 'swimming',
    unlocked: false,
    maxProgress: 1,
  },
  {
    id: 'poolside_bond',
    title: 'Lane 5 Secret',
    titleLt: '5 Takelio paslaptis',
    description: 'Share a breathless, tender moment with Dima at the lane barrier.',
    descriptionLt: 'Prie takelio bortelio pasidalink šilta, paslaptinga akimirka su Dima.',
    icon: 'Sparkles',
    category: 'romance',
    unlocked: false,
    maxProgress: 1,
  },
  {
    id: 'pastry_sweetness',
    title: 'Laisvės Alėja Warmth',
    titleLt: 'Laisvės alėjos šiluma',
    description: 'Accept Artem\'s warm pastry and walk with him under the Kaunas linden trees.',
    descriptionLt: 'Priimk Artemo šiltą kruasaną ir pasivaikščiok po Kauno liepomis.',
    icon: 'Coffee',
    category: 'romance',
    unlocked: false,
    maxProgress: 1,
  },
  {
    id: 'midnight_poet',
    title: 'Midnight Poet',
    titleLt: 'Naktinis poetas',
    description: 'Stay up late exchanging heartfelt messages with Roma about the future.',
    descriptionLt: 'Vėlų vakarą susirašinėk su Roma apie ateitį ir nepasakytus jausmus.',
    icon: 'Moon',
    category: 'romance',
    unlocked: false,
    maxProgress: 1,
  },
  {
    id: 'squad_love',
    title: 'Kaunas Squad Spirit',
    titleLt: 'Kauno komandos dvasia',
    description: 'Earn the trust and unwavering support of Yeva, Sofija, Austėja, and the gang.',
    descriptionLt: 'Užsitarnauk Yevos, Sofijos, Austėjos ir visos draugų kompanijos palaikymą.',
    icon: 'Users',
    category: 'squad',
    unlocked: false,
    maxProgress: 5,
  },
];

/**
 * Helper to check which achievements should be unlocked given player stats and story state
 */
export function evaluateAchievements(
  stats: PlayerStats,
  currentNodeId: string,
  recentlyCompletedLap?: boolean
): string[] {
  const newlyUnlocked: string[] = [];
  const currentUnlocked = new Set(stats.unlockedAchievements || []);

  const check = (id: string, condition: boolean) => {
    if (condition && !currentUnlocked.has(id)) {
      newlyUnlocked.push(id);
    }
  };

  // 1. Perfect Swim: 5+ perfect strokes
  check('perfect_swim', (stats.perfectStrokesCount || 0) >= 5);

  // 2. Deep Conversations: 5+ affection with any boy or 3+ deep talks count
  const maxBoyAffection = Math.max(
    stats.dimaAffection || 0,
    stats.artemAffection || 0,
    stats.romaAffection || 0
  );
  check('deep_conversations', maxBoyAffection >= 5 || (stats.deepTalksCount || 0) >= 3);

  // 3. First Lap: Completed at least one swim minigame (bestLapTime > 0 or flag)
  check('first_finish', (stats.bestLapTime > 0 && stats.bestLapTime < 999) || !!recentlyCompletedLap);

  // 4. Gold Medalist: Won championship
  check('gold_medalist', stats.championshipWon === true);

  // 5. Poolside bond: Dima affection >= 4
  check('poolside_bond', stats.dimaAffection >= 4);

  // 6. Pastry sweetness: Artem affection >= 4
  check('pastry_sweetness', stats.artemAffection >= 4);

  // 7. Midnight poet: Roma affection >= 4
  check('midnight_poet', stats.romaAffection >= 4);

  // 8. Squad love: Squad affection >= 5
  check('squad_love', (stats.squadAffection || 0) >= 5);

  return newlyUnlocked;
}
