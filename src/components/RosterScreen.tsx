import React, { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { CharacterId, Language } from '../types';
import { sound } from '../services/sound';
import { ArrowLeft, Heart, Globe, X } from 'lucide-react';

interface RosterScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onBack: () => void;
  onOpenPhoneWithBoy?: (boyId: string) => void;
}

export const RosterScreen: React.FC<RosterScreenProps> = ({
  language,
  onToggleLanguage,
  onBack,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<CharacterId>('amelia');
  const [filter, setFilter] = useState<'all' | 'boys' | 'friends'>('all');
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const isLt = language === 'lt';

  const boys: CharacterId[] = ['dima', 'artem', 'roma'];
  const friends: CharacterId[] = [
    'dominik',
    'austeja',
    'leja',
    'yeva',
    'sofija_p',
    'aukse',
    'sofija_k',
  ];

  const charList = Object.values(CHARACTERS).filter((c) => {
    if (c.id === 'narrator' || c.id === 'coach') return false;
    if (filter === 'boys') return boys.includes(c.id);
    if (filter === 'friends') return friends.includes(c.id);
    return true;
  });

  const selectedChar = CHARACTERS[selectedCharId] || CHARACTERS.amelia;

  const currentRole = isLt && selectedChar.roleLt ? selectedChar.roleLt : selectedChar.role;
  const currentBio = isLt && selectedChar.bioLt ? selectedChar.bioLt : selectedChar.bio;
  const currentStatus = isLt && selectedChar.statusLt ? selectedChar.statusLt : selectedChar.status;

  const handleCardClick = (id: CharacterId) => {
    sound.playSfx('click');
    setSelectedCharId(id);
    setMobileDetailOpen(true);
  };

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col bg-slate-950 font-sans text-slate-100 overflow-hidden select-none pb-[env(safe-area-inset-bottom)]">
      {/* Top Header: Responsive for Phone & Desktop */}
      <header className="p-3 sm:p-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={() => {
              sound.playSfx('click');
              onBack();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{isLt ? 'Atgal' : 'Back'}</span>
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-display font-extrabold text-white truncate">
              {isLt ? 'Gimnazijos veikėjai' : 'Gymnasium Roster'}
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden sm:block">
              {isLt
                ? 'Amelija, vaikinai (Dima, Artiomas, Roma) ir gimnazijos draugai'
                : 'Amelia, boyfriends (Dima, Artem, Roma) & friends'}
            </p>
          </div>
        </div>

        {/* Action Controls: Filter & Language */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-colors ${
                filter === 'all' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isLt ? 'Visi' : 'All'}
            </button>
            <button
              onClick={() => setFilter('boys')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-colors ${
                filter === 'boys' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isLt ? 'Vaikinai' : 'Boys'}
            </button>
            <button
              onClick={() => setFilter('friends')}
              className={`px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-colors ${
                filter === 'friends' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isLt ? 'Draugai' : 'Squad'}
            </button>
          </div>

          <button
            onClick={() => {
              sound.playSfx('click');
              onToggleLanguage();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-semibold flex items-center gap-1"
            title="Kalba"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLt ? 'LT' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* Main Split: Left Grid, Right Showcase */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Character Grid */}
        <div className="w-full md:w-1/2 p-3 sm:p-5 overflow-y-auto border-r border-slate-800 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {charList.map((char) => {
              const isSelected = char.id === selectedCharId;
              const isBoy = boys.includes(char.id);
              const charRole = isLt && char.roleLt ? char.roleLt : char.role;
              const charStatus = isLt && char.statusLt ? char.statusLt : char.status;

              return (
                <div
                  key={char.id}
                  onClick={() => handleCardClick(char.id)}
                  className={`p-3 rounded-2xl cursor-pointer border transition-all flex items-center gap-3 active:scale-[0.98] ${
                    isSelected
                      ? 'bg-slate-800 border-sky-400 shadow-md shadow-sky-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={char.avatar}
                    alt={char.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover object-top border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate">{char.name}</h3>
                      {isBoy && <Heart className="w-3 h-3 text-pink-400 fill-pink-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-sky-300 truncate">{charRole}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{charStatus}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Desktop Showcase */}
        <div className="hidden md:flex w-1/2 p-6 overflow-y-auto bg-slate-900/30 flex-col items-center justify-center text-center">
          <div className="max-w-md w-full flex flex-col items-center">
            <div className="relative w-48 h-56 rounded-3xl overflow-hidden border-2 border-sky-500/30 shadow-2xl mb-4 bg-slate-800">
              <img
                src={selectedChar.avatar}
                alt={selectedChar.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-display font-extrabold text-white">
                {selectedChar.name}
              </h2>
              {boys.includes(selectedChar.id) && (
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold">
                  {isLt ? 'Simpatija' : 'Crush'}
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-sky-400 mb-3">{currentRole}</p>

            <div className="w-full bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 mb-3 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {isLt ? 'Biografija ir ryšys' : 'Biography'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed mt-1">
                {currentBio}
              </p>
            </div>

            <div className="w-full bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {isLt ? 'Būsena' : 'Status'}
              </span>
              <p className="text-xs font-mono text-cyan-300 mt-0.5 italic">
                {currentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Detail Modal / Sheet */}
        {mobileDetailOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col items-center text-center max-h-[85vh] overflow-y-auto">
              <div className="w-full flex justify-end mb-1">
                <button
                  onClick={() => setMobileDetailOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative w-36 h-44 rounded-2xl overflow-hidden border border-sky-400/50 shadow-xl mb-3 bg-slate-800">
                <img
                  src={selectedChar.avatar}
                  alt={selectedChar.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="text-lg font-bold text-white">{selectedChar.name}</h3>
                {boys.includes(selectedChar.id) && (
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                )}
              </div>
              <p className="text-xs text-sky-400 mb-3">{currentRole}</p>

              <div className="w-full bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-left mb-2.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  {isLt ? 'Biografija' : 'Biography'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed mt-0.5">
                  {currentBio}
                </p>
              </div>

              <div className="w-full bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-left mb-4">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  {isLt ? 'Būsena' : 'Status'}
                </span>
                <p className="text-xs font-mono text-cyan-300 mt-0.5 italic">
                  {currentStatus}
                </p>
              </div>

              <button
                onClick={() => setMobileDetailOpen(false)}
                className="w-full py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
              >
                {isLt ? 'Uždaryti' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
