"use client"; // Need this for client-side JavaScript
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioInitialization } from "./hooks/useAudioInitialization";
import { useHooktheoryAuth } from "./hooks/useHooktheoryAuth";
import { getChordNotes } from "./utils/chordMappings";
import PlayButton from "./components/PlayButton";
import ChordKeyboard from "./components/ChordKeyboard";
import ProgressionGenerator from "./components/ProgressionGenerator";
import KeySelector from "./components/KeySelector";
import { transposeNotes } from "./utils/transposition";

export default function Home() {
  const { synth, audioInitialized, initializeAudio } = useAudioInitialization();
  const { authToken } = useHooktheoryAuth();
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [selectedKey, setSelectedKey] = useState("C");

  const playChord = (chord) => {
    if (!synth || !audioInitialized) return;

    console.log("Playing chord:", {
      original: chord.original,
      fromKey: "C",
      toKey: selectedKey,
    });

    const notes = getChordNotes(chord.original);
    console.log("Original notes:", notes);

    const transposedNotes = transposeNotes(notes, "C", selectedKey);
    console.log("Transposed notes:", transposedNotes);

    // Ensure the synth releases the previous notes
    synth.releaseAll();

    // Play the new notes
    setTimeout(() => {
      synth.triggerAttackRelease(transposedNotes, "2n");
    }, 50);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-cream">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {!audioInitialized ? (
            <motion.div
              key="play-button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.h1
                className="text-3xl font-bold text-center text-gray"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                Welcome to Chord Player
              </motion.h1>
              <PlayButton onClick={initializeAudio} />
            </motion.div>
          ) : (
            <motion.div
              key="main-interface"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                staggerChildren: 0.2,
              }}
              className="flex flex-col items-center gap-8 w-full"
            >
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isAdvancedMode}
                    onChange={(e) => setIsAdvancedMode(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-sand ring-4 ring-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-medium text-gray">
                    {isAdvancedMode ? "Advanced" : "Simple"} Mode
                  </span>
                </label>

                <KeySelector
                  selectedKey={selectedKey}
                  onKeyChange={setSelectedKey}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full"
              >
                <ChordKeyboard
                  audioInitialized={audioInitialized}
                  onChordClick={playChord}
                  isAdvancedMode={isAdvancedMode}
                  selectedKey={selectedKey}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full"
              >
                <ProgressionGenerator
                  authToken={authToken}
                  audioInitialized={audioInitialized}
                  onChordClick={playChord}
                  isAdvancedMode={isAdvancedMode}
                  selectedKey={selectedKey}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
