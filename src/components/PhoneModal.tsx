import React, { useState } from 'react';
import { ChatThread, ChatMessage, Language, CharacterId } from '../types';
import { CHARACTERS, CHARACTER_IMAGES } from '../data/characters';
import { sound } from '../services/sound';
import {
  MessageSquare,
  Image as ImageIcon,
  Heart,
  Send,
  X,
  Sparkles,
  Wifi,
  Battery,
} from 'lucide-react';

interface PhoneModalProps {
  language: Language;
  threads: ChatThread[];
  onSendMessageOption: (
    threadId: string,
    playerText: string,
    replyText: string,
    deltas: { dima?: number; artem?: number; roma?: number }
  ) => void;
  onClose: () => void;
  unlockedImages?: string[];
}

export const PhoneModal: React.FC<PhoneModalProps> = ({
  language,
  threads,
  onSendMessageOption,
  onClose,
  unlockedImages = [],
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'gallery'>('chats');
  const [activeThreadId, setActiveThreadId] = useState<string>('roma');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const isLt = language === 'lt';
  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSelectOption = (opt: {
    text: string;
    textLt?: string;
    dimaDelta?: number;
    artemDelta?: number;
    romaDelta?: number;
    reply: string;
    replyLt?: string;
  }) => {
    sound.playSfx('click');
    const pText = isLt && opt.textLt ? opt.textLt : opt.text;
    const rText = isLt && opt.replyLt ? opt.replyLt : opt.reply;

    onSendMessageOption(activeThread.id, pText, rText, {
      dima: opt.dimaDelta,
      artem: opt.artemDelta,
      roma: opt.romaDelta,
    });

    if (opt.dimaDelta || opt.artemDelta || opt.romaDelta) {
      setTimeout(() => {
        sound.playSfx('heart');
      }, 400);
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      sound.playSfx('ding');
    }, 1200);
  };

  const threadName = isLt && activeThread.nameLt ? activeThread.nameLt : activeThread.name;
  const threadSubtitle = isLt && activeThread.subtitleLt ? activeThread.subtitleLt : activeThread.subtitle;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Smartphone Outer Chassis */}
      <div className="relative w-full max-w-[420px] h-[720px] max-h-[92vh] bg-slate-900 border-4 border-slate-700/80 rounded-[44px] shadow-2xl overflow-hidden flex flex-col">
        {/* Phone Notch & Status Bar */}
        <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-300 font-medium select-none z-10 shrink-0 border-b border-slate-800">
          <span className="font-mono tabular-nums">22:45 · Kaunas</span>
          <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
            <button
              onClick={onClose}
              className="ml-2 p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* App Header / Tabs */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('chats')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'chats'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {isLt ? 'Pokalbiai' : 'Messenger'}
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {isLt ? 'Nuotraukos' : 'Memories'}
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {isLt ? 'Amelijos telefonas' : 'Amelia’s Phone'}
          </span>
        </div>

        {activeTab === 'chats' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Horizontal Chat Thread Picker */}
            <div className="flex items-center gap-2 p-2.5 bg-slate-950/60 border-b border-slate-800 overflow-x-auto shrink-0 no-scrollbar">
              {threads.map((t) => {
                const isSelected = t.id === activeThreadId;
                const displayName = isLt && t.nameLt ? t.nameLt : t.name;

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      sound.playSfx('click');
                      setActiveThreadId(t.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl whitespace-nowrap text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <img
                      src={t.avatar}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-white/20"
                    />
                    <span>{displayName}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Thread Details Header */}
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeThread.avatar}
                  alt={threadName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-sky-500/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {threadName}
                  </h4>
                  <p className="text-[10px] text-slate-400">{threadSubtitle}</p>
                </div>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
              {activeThread.messages.map((m) => {
                const isMe = m.senderId === 'player' || m.senderId === 'amelia';
                const senderChar = !isMe && m.senderId !== 'player' ? CHARACTERS[m.senderId as keyof typeof CHARACTERS] : null;
                const messageText = isLt && m.textLt ? m.textLt : m.text;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                      isMe ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    {!isMe && senderChar && (
                      <span className="text-[10px] font-semibold text-slate-400 mb-1 ml-1">
                        {senderChar.name}
                      </span>
                    )}

                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-sky-600 text-white rounded-br-xs shadow-md'
                          : 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700/60 shadow-sm'
                      }`}
                    >
                      {m.image && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-slate-700">
                          <img
                            src={m.image}
                            alt="Attachment"
                            referrerPolicy="no-referrer"
                            className="w-full h-36 object-cover"
                          />
                        </div>
                      )}
                      <p>{messageText}</p>
                    </div>

                    <span className="text-[9px] text-slate-500 mt-1 font-mono tabular-nums">
                      {m.timestamp}
                    </span>

                    {/* Interactive branching reply options */}
                    {m.options && m.options.length > 0 && (
                      <div className="mt-2.5 w-full space-y-1.5">
                        <span className="text-[10px] font-bold text-sky-400 tracking-wide uppercase">
                          {isLt ? 'Pasirinkti atsakymą:' : 'Choose Reply:'}
                        </span>
                        {m.options.map((opt, i) => {
                          const optText = isLt && opt.textLt ? opt.textLt : opt.text;
                          return (
                            <button
                              key={i}
                              onClick={() => handleSelectOption(opt)}
                              className="w-full text-left p-2.5 rounded-xl bg-slate-800/90 hover:bg-sky-600/30 active:bg-sky-600/50 border border-sky-500/30 text-sky-200 text-xs font-medium transition-all shadow-sm flex items-center justify-between group"
                            >
                              <span>{optText}</span>
                              <Send className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Realistic typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-2 bg-slate-800/80 rounded-2xl w-16 text-slate-400 text-xs">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
                </div>
              )}
            </div>

            {/* Simulated bottom chat bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
              <input
                disabled
                placeholder={isLt ? 'Pasirinkite vieną iš Amelijos atsakymų viršuje...' : 'Choose one of Amelia’s options above...'}
                className="flex-1 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-400 italic placeholder:text-slate-500"
              />
              <button
                onClick={() => sound.playSfx('ding')}
                className="p-2 rounded-xl bg-sky-600 text-white hover:bg-sky-500 transition-colors"
              >
                <Heart className="w-4 h-4 fill-white" />
              </button>
            </div>
          </div>
        ) : (
          /* Gallery Tab: Memories & Unlocked CGs */
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {isLt ? 'Užfiksuotos akimirkos' : 'Unlocked Moments'}
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {Object.keys(CHARACTER_IMAGES).length} {isLt ? 'nuotraukos' : 'Memories'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2.5">
                <img
                  src={CHARACTER_IMAGES.ameliaPortrait}
                  alt="Amelia True Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover object-top rounded-xl mb-2"
                />
                <h4 className="text-xs font-bold text-white">
                  {isLt ? 'Amelija: Portretas' : 'Amelia: Gymnasium Portrait'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isLt ? 'Kauno tarptautinės gimnazijos sportinė apranga' : 'Kaunas International Gymnasium Athletics'}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2.5">
                <img
                  src={CHARACTER_IMAGES.dima}
                  alt="Dima"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover rounded-xl mb-2"
                />
                <h4 className="text-xs font-bold text-white">
                  {isLt ? '5 Takelis: Dimos šypsena' : 'Lane 5: Dima’s Smirk'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isLt ? 'Po treniruotės prie baseino' : 'Post-workout lap times & poolside towel'}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2.5">
                <img
                  src={CHARACTER_IMAGES.artem}
                  alt="Artem"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover rounded-xl mb-2"
                />
                <h4 className="text-xs font-bold text-white">
                  {isLt ? 'Gimnazijos koridorius: Artiomas' : 'Hallway Locker 128: Artem'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isLt ? 'Kauno tarptautinė gimnazija' : 'Kaunas International Gymnasium'}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2.5">
                <img
                  src={CHARACTER_IMAGES.roma}
                  alt="Roma"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover rounded-xl mb-2"
                />
                <h4 className="text-xs font-bold text-white">
                  {isLt ? 'Naktis ir sniegas: Roma' : 'Snow & Night Lights: Roma'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {isLt ? 'Vakarinis pokalbis iš Sankt Peterburgo' : 'Late night texting from Saint Petersburg'}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2.5">
                <img
                  src={CHARACTER_IMAGES.schoolFriends}
                  alt="Kaunas Squad"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover rounded-xl mb-2"
                />
                <h4 className="text-xs font-bold text-white">
                  {isLt ? 'Kauno gimnazijos draugai' : 'The Kaunas Gymnasium Squad'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Dominik, Austėja, Lėja, Yeva, Sofijos & Auksė
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
