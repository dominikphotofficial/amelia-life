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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Smartphone Viewport: Full screen on mobile, realistic frame on desktop */}
      <div className="relative w-full h-[100dvh] sm:h-[740px] sm:max-h-[92vh] sm:max-w-[420px] bg-slate-900 sm:border-4 sm:border-slate-700/80 sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col">
        {/* Phone Notch & Status Bar */}
        <div className="bg-slate-950 px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-300 font-medium select-none z-10 shrink-0 border-b border-slate-800">
          <span className="font-mono tabular-nums text-[11px] sm:text-xs">22:45 · Kaunas</span>
          <div className="w-16 sm:w-20 h-3.5 sm:h-4 bg-slate-800 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <button
              onClick={onClose}
              className="ml-1 p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Uždaryti"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* App Header / Tabs */}
        <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
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
              {isLt ? 'Galerija' : 'Gallery'}
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            {isLt ? 'Amelijos telefonas' : 'Amelia’s Phone'}
          </span>
        </div>

        {activeTab === 'chats' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Horizontal Chat Thread Picker */}
            <div className="flex items-center gap-2 p-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto shrink-0 no-scrollbar">
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
                    className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-2xl whitespace-nowrap text-xs font-medium transition-all shrink-0 ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <img
                      src={t.avatar}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover object-top border border-white/20"
                    />
                    <span className="text-xs">{displayName}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Thread Details Header */}
            <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeThread.avatar}
                  alt={threadName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover object-top border border-sky-500/40"
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
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-slate-950/40">
              {activeThread.messages.map((m) => {
                const isMe = m.senderId === 'player' || m.senderId === 'amelia';
                const senderChar = !isMe && m.senderId !== 'player' ? CHARACTERS[m.senderId as keyof typeof CHARACTERS] : null;
                const messageText = isLt && m.textLt ? m.textLt : m.text;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[88%] ${
                      isMe ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    {!isMe && senderChar && (
                      <span className="text-[10px] font-semibold text-slate-400 mb-1 ml-1">
                        {senderChar.name}
                      </span>
                    )}

                    <div
                      className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl text-xs leading-relaxed ${
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
                            className="w-full h-36 object-cover object-top"
                          />
                        </div>
                      )}
                      <p>{messageText}</p>
                    </div>

                    <span className="text-[9px] text-slate-500 mt-0.5 font-mono tabular-nums">
                      {m.timestamp}
                    </span>

                    {/* Interactive branching reply options */}
                    {m.options && m.options.length > 0 && (
                      <div className="mt-2 w-full space-y-1.5">
                        <span className="text-[10px] font-bold text-sky-400 tracking-wide uppercase">
                          {isLt ? 'Pasirinkti atsakymą:' : 'Choose Reply:'}
                        </span>
                        {m.options.map((opt, i) => {
                          const optText = isLt && opt.textLt ? opt.textLt : opt.text;
                          return (
                            <button
                              key={i}
                              onClick={() => handleSelectOption(opt)}
                              className="w-full text-left p-2.5 rounded-xl bg-slate-800/90 hover:bg-sky-600/30 active:bg-sky-600/50 border border-sky-500/30 text-sky-200 text-xs font-medium transition-all shadow-sm flex items-center justify-between group min-h-[40px]"
                            >
                              <span className="pr-1 leading-snug">{optText}</span>
                              <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-2 bg-slate-800/80 rounded-2xl w-14 text-slate-400 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
              <input
                disabled
                placeholder={isLt ? 'Pasirinkite atsakymą viršuje...' : 'Choose reply option above...'}
                className="flex-1 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-400 italic placeholder:text-slate-500"
              />
              <button
                onClick={() => sound.playSfx('ding')}
                className="p-2 rounded-xl bg-sky-600 text-white hover:bg-sky-500 transition-colors shrink-0"
              >
                <Heart className="w-4 h-4 fill-white" />
              </button>
            </div>
          </div>
        ) : (
          /* Gallery Tab: Memories & Unlocked European Portraits */
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {isLt ? 'Veikėjų portretai' : 'Character Portraits'}
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {isLt ? 'Kauno gimnazija' : 'Kaunas Gymnasium'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2">
                <img
                  src={CHARACTER_IMAGES.ameliaPortrait}
                  alt="Amelia Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover object-top rounded-xl mb-1.5"
                />
                <h4 className="text-xs font-bold text-white">
                  {isLt ? 'Amelija (Pagal jūsų aprašymą)' : 'Amelia (True Portrait)'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {isLt ? 'Švelnus ovalus veidas, natūralūs bruožai, Kauno gimnazijos striukė' : 'Soft oval face, natural European features, KIG jacket'}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2">
                <img
                  src={CHARACTER_IMAGES.dima}
                  alt="Dima"
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover object-top rounded-xl mb-1.5"
                />
                <h4 className="text-xs font-bold text-white">
                  {isLt ? 'Dima (Plaukikas · 5 takelis)' : 'Dima (Swimmer · Lane 5)'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {isLt ? 'Europietiškų bruožų atletas, baseino partneris' : 'Athletic European swimmer, pool teammate'}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2">
                <img
                  src={CHARACTER_IMAGES.artem}
                  alt="Artem"
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover object-top rounded-xl mb-1.5"
                />
                <h4 className="text-xs font-bold text-white">
                  {isLt ? 'Artiomas (Klasiokas · Gimnazijos koridorius)' : 'Artem (Classmate · Gymnasium Hallway)'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {isLt ? 'Stilingas gimnazistas su švarku ir šypsena' : 'Stylish student council member with blazer'}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2">
                <img
                  src={CHARACTER_IMAGES.roma}
                  alt="Roma"
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover object-top rounded-xl mb-1.5"
                />
                <h4 className="text-xs font-bold text-white">
                  {isLt ? 'Roma (Susirašinėjimas · Naktis)' : 'Roma (Slavic Crush · Saint Petersburg)'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {isLt ? 'Jaukus bliuzonas, apsnigti Sankt Peterburgo žibintai' : 'Chunky knit hoodie, cozy evening window and phone'}
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/60 p-2">
                <img
                  src={CHARACTER_IMAGES.schoolFriends}
                  alt="Kaunas Squad"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover object-center rounded-xl mb-1.5"
                />
                <h4 className="text-xs font-bold text-white">
                  {isLt ? 'Gimnazijos draugų kompanija' : 'The Kaunas Gymnasium Squad'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  Dominik, Austėja, Lėja, Yeva, abi Sofijos ir Auksė
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
