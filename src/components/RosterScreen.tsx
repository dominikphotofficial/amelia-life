import React, { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { CharacterId, Language } from '../types';
import { sound } from '../services/sound';
import { ArrowLeft, Heart, Globe } from 'lucide-react';

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

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 font-sans text-slate-100 overflow-hidden select-none">
      {/* Top Header */}
      <header className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playSfx('click');
              onBack();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isLt ? 'Atgal' : 'Back'}</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-display font-extrabold text-white">
              {isLt ? 'Kauno tarptautinės gimnazijos veikėjai' : 'Kaunas International Gymnasium Roster'}
            </h1>
            <p className="text-xs text-slate-400">
              {isLt
                ? 'Amelija, jos vaikinai (Dima, Artiomas, Roma) ir draugų kompanija'
                : 'Amelia, her boyfriends (Dima, Artem, Roma) & high school friends'}
            </p>
          </div>
        </div>

        {/* Action Controls: Filter & Language */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'all' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isLt ? `Visi (${charList.length})` : `All (${charList.length})`}
            </button>
            <button
              onClick={() => setFilter('boys')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'boys' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isLt ? 'Vaikinai (3)' : 'Boyfriends (3)'}
            </button>
            <button
              onClick={() => setFilter('friends')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'friends' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isLt ? 'Draugai (7)' : 'Squad (7)'}
            </button>
          </div>

          <button
            onClick={() => {
              sound.playSfx('click');
              onToggleLanguage();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
            title="Pakeisti kalbą"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isLt ? 'LT' : 'EN'}</span>
          </button>
        </div>
      </header>

      {/* Main Split View: Left Thumbnails, Right Deep Profile */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Character Grid */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 overflow-y-auto border-r border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {charList.map((char) => {
              const isSelected = char.id === selectedCharId;
              const isBoy = boys.includes(char.id);
              const charRole = isLt && char.roleLt ? char.roleLt : char.role;
              const charStatus = isLt && char.statusLt ? char.statusLt : char.status;

              return (
                <div
                  key={char.id}
                  onClick={() => {
                    sound.playSfx('click');
                    setSelectedCharId(char.id);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer border transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-slate-800 border-sky-400 shadow-lg shadow-sky-500/10 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <img
                    src={char.avatar}
                    alt={char.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover object-top border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white truncate">{char.name}</h3>
                      {isBoy && <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-sky-300 truncate">{charRole}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{charStatus}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Character Detailed Profile Showcase */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto bg-slate-900/30 flex flex-col items-center justify-center text-center">
          <div className="max-w-md w-full flex flex-col items-center">
            {/* Portrait Card */}
            <div className="relative w-48 h-56 sm:w-56 sm:h-64 rounded-3xl overflow-hidden border-2 border-sky-500/30 shadow-2xl mb-6 bg-slate-800">
              <img
                src={selectedChar.avatar}
                alt={selectedChar.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {selectedChar.name}
              </h2>
              {boys.includes(selectedChar.id) && (
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold">
                  {isLt ? 'Romantinis susidomėjimas' : 'Romantic Interest'}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-sky-400 mb-4">{currentRole}</p>

            <div className="w-full bg-slate-900/80 p-4 rounded-2xl border border-slate-800 mb-6 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {isLt ? 'Biografija ir ryšys su Amelija' : 'Biography & Connection'}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-1">
                {currentBio}
              </p>
            </div>

            <div className="w-full bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {isLt ? 'Būsena / Citata' : 'Current Status / Quote'}
              </span>
              <p className="text-xs sm:text-sm font-mono text-cyan-300 mt-1 italic">
                {currentStatus}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
