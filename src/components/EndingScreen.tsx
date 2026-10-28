import React, { useEffect } from 'react';
import { PlayerStats, Language } from '../types';
import { CHARACTER_IMAGES } from '../data/characters';
import { sound } from '../services/sound';
import { RotateCcw, Award } from 'lucide-react';

interface EndingScreenProps {
  language: Language;
  stats: PlayerStats;
  onRestart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ language, stats, onRestart }) => {
  const isLt = language === 'lt';

  useEffect(() => {
    sound.playSfx('cheer');
    sound.playBGM('romantic');
  }, []);

  let endingType: 'dima' | 'artem' | 'roma' | 'squad' | 'harem' = 'dima';

  if (stats.dimaAffection >= 10 && stats.artemAffection >= 10 && stats.romaAffection >= 10) {
    endingType = 'harem';
  } else if (
    stats.dimaAffection >= stats.artemAffection &&
    stats.dimaAffection >= stats.romaAffection &&
    stats.dimaAffection >= stats.squadAffection
  ) {
    endingType = 'dima';
  } else if (
    stats.artemAffection >= stats.dimaAffection &&
    stats.artemAffection >= stats.romaAffection &&
    stats.artemAffection >= stats.squadAffection
  ) {
    endingType = 'artem';
  } else if (
    stats.romaAffection >= stats.dimaAffection &&
    stats.romaAffection >= stats.artemAffection
  ) {
    endingType = 'roma';
  } else {
    endingType = 'squad';
  }

  const endingsData = {
    dima: {
      title: isLt ? '1 PABAIGA: OLIMPINIS DUETAS' : 'ENDING 1: THE OLYMPIC DUO',
      subtitle: isLt ? 'Aukso medaliai ir pažadas prie baseino' : 'Gold Medals & A Poolside Promise',
      charName: 'Dima',
      image: CHARACTER_IMAGES.dima,
      epilogue: isLt
        ? 'Po Kauno olimpinio centro švieslentėmis arena vis dar skamba nuo tavo 1 vietos finišo. Dima priplaukia prie tavo takelio, varvantis vandeniu, ir priglaudžia savo sidabro medalį prie tavo aukso. „Mes pradėjome 4 ir 5 takeliuose,“ – švelniai nusišypso jis, nubraukdamas šlapią sruogą tau nuo kaktos. „Nuo šiol gyvenimo takeliais noriu plaukti tik su tavimi, Amelija.“'
        : 'Under the shimmering stadium lights of the Kaunas Olympic Aquatic Centre, the crowd is still echoing your 1st place touch. Dima climbs up to your lane, dripping with water, and places his silver medal against your gold. "We started in Lane 4 and 5," he smiles softly, brushing a damp lock of hair behind your ear. "From now on, I only want to swim through life with you, Amelia."',
    },
    artem: {
      title: isLt ? '2 PABAIGA: GIMNAZIJOS PASAKA' : 'ENDING 2: GYMNASIUM FAIRYTALE',
      subtitle: isLt ? 'Žvaigždėtas šokis Kauno tarptautinėje gimnazijoje' : 'Starlight Dance at Kaunas International Gymnasium',
      charName: isLt ? 'Artiomas' : 'Artem',
      image: CHARACTER_IMAGES.artem,
      epilogue: isLt
        ? 'Gimnazijos pobūvių salė nušviesta lempučių girliandomis. Priešais visus mokinius Artiomas užlipa ant scenos su akustine gitara ir skiria dainą „merginai, kuri plaukia greičiau už vėją“. Prasidėjus lėtam šokiui, jis nusileidžia nuo scenos, paima tavo ranką ir nusiveda į nepamirštamą šokį po žvaigždėmis.'
        : 'The gymnasium ballroom is decorated in midnight blue fairy lights. In front of the entire student body, Artem steps onto the stage with his acoustic guitar, dedicating his final melody to "the girl who swims like lightning." As the slow song begins, he steps down, takes your hand, and spins you across the floor into a tender, unforgettable slow dance.',
    },
    roma: {
      title: isLt ? '3 PABAIGA: IŠTRINTOS SIENOS' : 'ENDING 3: BORDERS DISSOLVED',
      subtitle: isLt ? 'Netikėtumas tribūnose' : 'The Surprise in the Bleachers',
      charName: 'Roma',
      image: CHARACTER_IMAGES.roma,
      epilogue: isLt
        ? 'Išlipus iš baseino su aukso medaliu, prie tribūnų atitvaro prieina aukštas vaikinas su tamsiu gobtuvu ir didele mėlynų hortenzijų puokšte. Tai Roma! Jis leidosi į 20 valandų kelionę iš Sankt Peterburgo, kad tik pamatytų tavo startą. „Sakiau, kad atstumas manęs nesulaikys, mano žuvele,“ – sušnypščia jis, stipriai tave apkabindamas.'
        : 'As you step out of the pool with your medal, a tall boy wearing a dark knit hoodie approaches the edge of the bleachers, holding a bouquet of deep blue hydrangeas. It’s Roma! He took a 20-hour journey across the border from Saint Petersburg just to see your race. "I told you distance couldn’t stop me, moya rybka," he whispers, pulling you into the warmest hug of your life.',
    },
    squad: {
      title: isLt ? '4 PABAIGA: KAUNO SEPTYNETAS' : 'ENDING 4: THE KAUNAS SEVEN',
      subtitle: isLt ? 'Tikros draugystės čempionai' : 'Champions of Friendship',
      charName: 'Kauno komanda',
      image: CHARACTER_IMAGES.schoolFriends,
      epilogue: isLt
        ? 'Dominikas su džiaugsmu pūtė savo trimitą, o Austėja, Lėja, Yeva, abi Sofijos ir Auksė pakelia tave ant rankų! Kam reikalingos vaikinų dramos, kai turi pačius nuostabiausius draugus visoje Lietuvoje? Visi kartu einate Laisvės alėja, valgote ledus ir švenčiate aukso medalį.'
        : 'Dominik blows his airhorn with unbridled joy as Austėja, Lėja, Yeva, Sofija P., Auksė, and other Sofija hoist you onto their shoulders! Who needs boy drama when you have the greatest best friends in Lithuania? Together, you walk down Laisvės alėja enjoying ice cream, celebrating your gold medal and lifelong bonds.',
    },
    harem: {
      title: isLt ? 'SPECIALI PABAIGA: ŠIRDŽIŲ KARALIENĖ' : 'SPECIAL ENDING: QUEEN OF HEARTS',
      subtitle: isLt ? 'Trys vaikinai ir nesustabdoma čempionė' : 'Three Boyfriends & An Unstoppable Champion',
      charName: 'Dima, Artiomas ir Roma',
      image: CHARACTER_IMAGES.ameliaPortrait,
      epilogue: isLt
        ? 'Penktadienio pokylyje Dima tau atneša kokteilį, Artiomas įteikia rožę, o Roma pakelia tostą už tavo plaukimo rekordą! Visi trys supranta: Amelija yra viena ir nepakartojama. Tu valdai baseino vandenis ir visas tris širdis su tikru čempionės grakštumu!'
        : 'At the Friday night Gala, Dima hands you an electrolyte cocktail, Artem presents you with a red rose, and Roma raises a toast to your swimming triumph! Seeing your dedication and warm heart, all three boys agree: Amelia is one of a kind. You rule the pool and all three hearts with undisputed grace!',
    },
  };

  const currentEnding = endingsData[endingType];

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col items-center justify-center p-3.5 sm:p-8 bg-slate-950 font-sans select-none overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={currentEnding.image}
          alt={currentEnding.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top filter blur-md opacity-25 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-xl w-full bg-slate-900/95 backdrop-blur-xl border border-sky-500/40 rounded-3xl p-4 sm:p-7 shadow-2xl flex flex-col items-center text-center my-auto animate-in zoom-in-95 duration-300">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2.5 sm:mb-4 shadow-lg">
          <Award className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <span className="text-[10px] sm:text-xs font-bold text-sky-400 tracking-widest uppercase mb-0.5">
          {currentEnding.title}
        </span>
        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white mb-3">
          {currentEnding.subtitle}
        </h2>

        {/* Ending Portrait Card */}
        <div className="w-full h-44 sm:h-60 rounded-2xl overflow-hidden border border-slate-700 mb-3.5 relative shadow-xl bg-slate-800">
          <img
            src={currentEnding.image}
            alt={currentEnding.charName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Epilogue narrative */}
        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-4 bg-slate-950/60 p-3 sm:p-4 rounded-2xl border border-slate-800 text-left">
          {currentEnding.epilogue}
        </p>

        {/* Final Romance Score Summary */}
        <div className="w-full grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-cyan-500/30">
            <span className="text-[9px] sm:text-[10px] text-cyan-300 font-semibold block">Dima</span>
            <span className="text-sm sm:text-base font-mono font-bold text-white tabular-nums">
              {stats.dimaAffection} {isLt ? 'tšk.' : 'pts'}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/80 border border-amber-500/30">
            <span className="text-[9px] sm:text-[10px] text-amber-300 font-semibold block">{isLt ? 'Artiomas' : 'Artem'}</span>
            <span className="text-sm sm:text-base font-mono font-bold text-white tabular-nums">
              {stats.artemAffection} {isLt ? 'tšk.' : 'pts'}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/80 border border-violet-500/30">
            <span className="text-[9px] sm:text-[10px] text-violet-300 font-semibold block">Roma</span>
            <span className="text-sm sm:text-base font-mono font-bold text-white tabular-nums">
              {stats.romaAffection} {isLt ? 'tšk.' : 'pts'}
            </span>
          </div>
        </div>

        {/* Restart Action */}
        <button
          onClick={onRestart}
          className="w-full py-3 sm:py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-display font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-sky-600/30 transition-all flex items-center justify-center gap-2 min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isLt ? 'ŽAISTI IŠ NAUJO' : 'PLAY AGAIN'}</span>
        </button>
      </div>
    </div>
  );
};
