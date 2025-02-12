import { motion, AnimatePresence } from "framer-motion";
import { allChords } from "../utils/chordMappings";
import { transposeChord } from "../utils/transposition";

const advancedChords = [
  { original: "I", display: "C" },
  { original: "ii", display: "Dm" },
  { original: "iii", display: "Em" },
  { original: "IV", display: "F" },
  { original: "V", display: "G" },
  { original: "vi", display: "Am" },
  { original: "vii°", display: "B°" },
  { original: "27", display: "Dm7" },
  { original: "47", display: "F7" },
  { original: "57", display: "G7" },
  { original: "67", display: "Am7" },
  { original: "37", display: "Em7" },
  { original: "17", display: "C7" },
  { original: "16", display: "C6" },
  { original: "36", display: "Em6" },
  { original: "46", display: "F6" },
  { original: "66", display: "Am6" },
  { original: "5/6", display: "G/A" },
  { original: "57/6", display: "G7/A" },
  { original: "5/5", display: "G/G" },
  { original: "164", display: "C6/4" },
  { original: "464", display: "F6/4" },
  { original: "564", display: "G6/4" },
  { original: "664", display: "Am6/4" },
  { original: "b7", display: "B♭" },
  { original: "b6", display: "A♭" },
  { original: "b3", display: "E♭" },
  { original: "642", display: "Am6/4/D" },
];

export default function ChordKeyboard({
  audioInitialized,
  onChordClick,
  isAdvancedMode,
  selectedKey,
}) {
  const chords = isAdvancedMode ? advancedChords : allChords;

  const getTransposedChord = (chord) => {
    return {
      ...chord,
      display: transposeChord(chord.display, "C", selectedKey),
    };
  };

  const getTextSize = (text) => {
    if (text.length > 4) return "text-sm";
    if (text.length > 3) return "text-base";
    return "text-lg";
  };

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <h2 className="text-xl uppercase font-bold text-center">
        Chord Free Player
      </h2>
      <motion.div
        layout="position"
        className={`
          grid grid-cols-4 sm:grid-cols-7 gap-4 w-full place-items-center 
          ${isAdvancedMode ? "min-h-[320px]" : "min-h-[180px]"}
          overflow-y-auto p-4
        `}
        style={{
          gridTemplateRows: `repeat(${Math.ceil(chords.length / 7)}, ${
            isAdvancedMode ? "minmax(64px, 64px)" : "minmax(64px, 1fr)"
          })`,
        }}
      >
        <AnimatePresence mode="wait">
          {chords.map((chord) => {
            const transposedChord = getTransposedChord(chord);
            return (
              <motion.div
                key={chord.original}
                className="relative w-16 h-16 group"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{
                  scale: 1,
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-conic opacity-0 group-hover:opacity-100 -z-10 [transition:opacity_150ms_ease-in] [&:hover]:transition-[opacity_2000ms_ease-out]"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <button
                  onClick={() => onChordClick(chord)}
                  disabled={!audioInitialized}
                  className={`
                    absolute inset-[1px] rounded-full bg-gray-100 text-accent-1 shadow-lg 
                    flex items-center justify-center z-10
                    ${!audioInitialized ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  style={{
                    backdropFilter: "none",
                    WebkitBackdropFilter: "none",
                  }}
                >
                  <span
                    className={`relative ${getTextSize(
                      transposedChord.display
                    )}`}
                  >
                    {transposedChord.display}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
