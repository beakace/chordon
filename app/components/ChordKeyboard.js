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

  return (
    <motion.div
      layout
      className="grid grid-cols-4 sm:grid-cols-7 gap-2 w-full place-items-center"
    >
      <AnimatePresence mode="wait">
        {chords.map((chord) => {
          const transposedChord = getTransposedChord(chord);
          return (
            <motion.button
              key={chord.original}
              onClick={() => onChordClick(chord)}
              disabled={!audioInitialized}
              className={`px-4 py-2 text-white rounded min-w-[60px] h-[40px] flex items-center justify-center ${
                !audioInitialized
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
              transition={{
                opacity: { duration: 0.2 },
                layout: { duration: 0.3 },
                scale: { duration: 0.2 },
              }}
              whileHover={{
                scale: audioInitialized ? 1.05 : 1,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: audioInitialized ? 0.95 : 1,
                transition: { duration: 0.1 },
              }}
            >
              {transposedChord.display}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
