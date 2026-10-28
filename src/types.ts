/**
 * Type definitions for Amelia: Heart in the Deep End
 */

export type ScreenMode = 
  | 'TITLE'
  | 'STORY'
  | 'SWIMMING'
  | 'PHONE'
  | 'ROSTER'
  | 'GALLERY'
  | 'ENDING';

export type Day = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
export type DayPeriod = 'MORNING_SCHOOL' | 'AFTERNOON_POOL' | 'EVENING_ROOM';

export type CharacterId = 
  | 'amelia'
  | 'dima'
  | 'artem'
  | 'roma'
  | 'dominik'
  | 'austeja'
  | 'leja'
  | 'yeva'
  | 'sofija_p'
  | 'aukse'
  | 'sofija_k'
  | 'narrator'
  | 'coach';

export type Language = 'lt' | 'en';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  role: string;
  roleLt?: string;
  bio: string;
  bioLt?: string;
  avatar: string;
  themeColor: string;
  status: string;
  statusLt?: string;
}

export interface DialogueChoice {
  id: string;
  text: string;
  textLt?: string;
  dimaDelta?: number;
  artemDelta?: number;
  romaDelta?: number;
  staminaDelta?: number;
  squadDelta?: number;
  reactionText?: string;
  reactionTextLt?: string;
  nextNodeId: string;
}

export interface StoryNode {
  id: string;
  day: Day;
  period: DayPeriod;
  chapterTitle: string;
  chapterTitleLt?: string;
  locationName: string;
  locationNameLt?: string;
  speakerId: CharacterId;
  text: string;
  textLt?: string;
  bgImage?: string;
  activeCharacterImage?: string;
  choices?: DialogueChoice[];
  nextNodeId?: string;
  triggerSwimMinigame?: boolean;
  minigameDifficulty?: 'practice' | 'time_trial' | 'championship';
  triggerEveningPhone?: boolean;
  isEndingCheck?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: CharacterId | 'player';
  text: string;
  textLt?: string;
  timestamp: string;
  image?: string;
  options?: {
    text: string;
    textLt?: string;
    dimaDelta?: number;
    artemDelta?: number;
    romaDelta?: number;
    reply: string;
    replyLt?: string;
  }[];
}

export interface ChatThread {
  id: 'roma' | 'dima' | 'artem' | 'kaunas_squad';
  name: string;
  nameLt?: string;
  subtitle: string;
  subtitleLt?: string;
  avatar: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface PlayerStats {
  dimaAffection: number;
  artemAffection: number;
  romaAffection: number;
  squadAffection: number;
  swimmingSkill: number;
  bestLapTime: number; // in seconds
  championshipWon: boolean;
}

export interface GameSaveState {
  currentNodeId: string;
  day: Day;
  period: DayPeriod;
  stats: PlayerStats;
  readNodes: string[];
  chatHistory: Record<string, ChatMessage[]>;
  timestamp: number;
}
