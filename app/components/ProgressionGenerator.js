import { useState, useRef, useEffect } from "react";
import ChordButton from "./ChordButton";
import LoadingSpinner from "./LoadingSpinner";
import {
  getBaseChord,
  getRealChordName,
  getAdvancedChordName,
} from "../utils/chordMappings";
import { transposeChord } from "../utils/transposition";

// Mapping from API chord notation to our chord format
const apiChordMapping = {
  // Basic chords
  I: { original: "I", display: "C" },
  i: { original: "i", display: "Cm" },
  ii: { original: "ii", display: "Dm" },
  iii: { original: "iii", display: "Em" },
  IV: { original: "IV", display: "F" },
  iv: { original: "iv", display: "Fm" },
  V: { original: "V", display: "G" },
  v: { original: "v", display: "Gm" },
  vi: { original: "vi", display: "Am" },
  "vii°": { original: "vii°", display: "B°" },

  // Seventh chords
  "I<sup>7</sup>": { original: "17", display: "C7" },
  "ii<sup>7</sup>": { original: "27", display: "Dm7" },
  "iii<sup>7</sup>": { original: "37", display: "Em7" },
  "IV<sup>7</sup>": { original: "47", display: "F7" },
  "iv<sup>7</sup>": { original: "b47", display: "Fm7" },
  "V<sup>7</sup>": { original: "57", display: "G7" },
  "v<sup>7</sup>": { original: "b57", display: "Gm7" },
  "vi<sup>7</sup>": { original: "67", display: "Am7" },

  // Sixth chords
  "I<sup>6</sup>": { original: "16", display: "C6" },
  "iii<sup>6</sup>": { original: "36", display: "Em6" },
  "IV<sup>6</sup>": { original: "46", display: "F6" },
  "iv<sup>6</sup>": { original: "b46", display: "Fm6" },
  "vi<sup>6</sup>": { original: "66", display: "Am6" },

  // Slash chords
  "V/vi": { original: "5/6", display: "G/A" },
  "V<sup>7</sup>/vi": { original: "57/6", display: "G7/A" },
  "V/V": { original: "5/5", display: "G/G" },

  // 6/4 chords
  "I<sup>6</sup><sub>4</sub>": { original: "164", display: "C6/4" },
  "IV<sup>6</sup><sub>4</sub>": { original: "464", display: "F6/4" },
  "iv<sup>6</sup><sub>4</sub>": { original: "b464", display: "Fm6/4" },
  "V<sup>6</sup><sub>4</sub>": { original: "564", display: "G6/4" },
  "vi<sup>6</sup><sub>4</sub>": { original: "664", display: "Am6/4" },

  // Flat chords
  "&#9837;VII": { original: "b7", display: "B♭" },
  "&#9837;III": { original: "b3", display: "E♭" },
  "&#9837;VI": { original: "b6", display: "A♭" },

  // Complex chords
  "vi<sup>4</sup><sub>2</sub>": { original: "642", display: "Am6/4/D" },
  "iv<sup>4</sup><sub>2</sub>": { original: "b442", display: "Fm6/4/B♭" },
};

export default function ProgressionGenerator({
  authToken,
  audioInitialized,
  onChordClick,
  isAdvancedMode,
  selectedKey,
}) {
  const [progression, setProgression] = useState(Array(4).fill(null));
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [bpm, setBpm] = useState(60); // Default 60 BPM
  const intervalRef = useRef(null);

  // Convert BPM to milliseconds (4 beats per chord)
  const getBpmInMs = () => (60 / (bpm / 4)) * 1000;

  const createChordObject = (apiChord) => {
    const chordHTML = apiChord.chord_HTML;
    console.log("Processing chord:", {
      html: chordHTML,
      mappedChord: apiChordMapping[chordHTML],
    });

    const mappedChord = apiChordMapping[chordHTML];

    if (!mappedChord) {
      console.warn("Unknown chord:", chordHTML);
    }

    const baseChordObj = {
      original: mappedChord ? mappedChord.original : "I",
      display: mappedChord
        ? isAdvancedMode
          ? mappedChord.display
          : getRealChordName(getBaseChord(chordHTML))
        : "C",
      childPath: apiChord.child_path,
    };

    // Transpose the display name if needed
    if (selectedKey !== "C") {
      baseChordObj.display = transposeChord(
        baseChordObj.display,
        "C",
        selectedKey
      );
    }

    console.log("Created chord object:", baseChordObj);
    return baseChordObj;
  };

  const fetchProgression = async () => {
    if (!authToken) {
      console.error("No auth token available");
      return;
    }

    setProgression(Array(4).fill(null));

    try {
      setLoadingIndex(0);
      const response = await fetch(
        "https://api.hooktheory.com/v1/trends/nodes",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();
      console.log("Initial chord options:", data);

      const totalProb = data.reduce((sum, chord) => sum + chord.probability, 0);
      let random = Math.random() * totalProb;
      let firstChord = data[0];

      for (const chord of data) {
        if (random <= chord.probability) {
          firstChord = chord;
          break;
        }
        random -= chord.probability;
      }

      const newProgression = [...progression];
      newProgression[0] = createChordObject(firstChord);

      console.log("First chord:", {
        raw: firstChord.chord_HTML,
        processed: newProgression[0],
      });

      setProgression(newProgression);
      await new Promise((resolve) => setTimeout(resolve, 300));

      for (let i = 0; i < 3; i++) {
        setLoadingIndex(i + 1);
        const nextResponse = await fetch(
          `https://api.hooktheory.com/v1/trends/nodes?cp=${newProgression[i].childPath}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const nextData = await nextResponse.json();
        console.log(
          `Possible next chords after ${newProgression[i].display}:`,
          nextData
        );

        if (nextData && nextData.length > 0) {
          const totalProb = nextData.reduce(
            (sum, chord) => sum + chord.probability,
            0
          );
          let random = Math.random() * totalProb;
          let nextChord = nextData[0];

          for (const chord of nextData) {
            if (random <= chord.probability) {
              nextChord = chord;
              break;
            }
            random -= chord.probability;
          }

          newProgression[i + 1] = createChordObject(nextChord);

          console.log(`Selected chord ${i + 1}:`, {
            raw: nextChord.chord_HTML,
            processed: newProgression[i + 1],
          });

          setProgression([...newProgression]);
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
    } catch (error) {
      console.error("Error fetching progression:", error);
    } finally {
      setLoadingIndex(null);
    }
  };

  const playProgression = () => {
    if (!audioInitialized || !progression.every((chord) => chord) || isPlaying)
      return;

    setIsPlaying(true);
    let currentIndex = 0;
    setCurrentPlayingIndex(currentIndex);

    // Play first chord immediately
    onChordClick(progression[currentIndex]);

    // Set up the interval for looping with current BPM
    intervalRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % progression.length;
      setCurrentPlayingIndex(currentIndex);
      onChordClick(progression[currentIndex]);
    }, getBpmInMs());
  };

  const stopProgression = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentPlayingIndex(null);
  };

  // Update interval when BPM changes
  useEffect(() => {
    if (isPlaying) {
      stopProgression();
      playProgression();
    }
  }, [bpm]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center mt-8">
      <h2 className="text-xl font-bold">Random Progression</h2>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <label htmlFor="bpm" className="text-sm font-medium">
            BPM: {bpm}
          </label>
          <input
            type="range"
            id="bpm"
            min="30"
            max="240"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={fetchProgression}
        disabled={!authToken || !audioInitialized || loadingIndex !== null}
        className={`px-4 py-2 text-white rounded flex items-center gap-2 ${
          !authToken || !audioInitialized || loadingIndex !== null
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-secondary hover:bg-secondary/80"
        }`}
      >
        {!audioInitialized
          ? "Initialize Audio First"
          : "Get Random Progression"}
      </button>

      <div className="flex gap-2">
        {progression.map((chord, index) => (
          <button
            key={index}
            onClick={() => chord && onChordClick(chord)}
            disabled={!audioInitialized || !chord || loadingIndex === index}
            className={`px-4 py-2 text-white rounded min-w-[60px] h-[40px] flex items-center justify-center 
              ${
                !audioInitialized || !chord
                  ? "bg-gray-500 cursor-not-allowed"
                  : currentPlayingIndex === index
                  ? "bg-accent-1 ring-2 ring-accent-1 ring-offset-2 ring-offset-gray-800"
                  : "bg-accent-2 hover:bg-accent-2"
              } transition-all duration-150`}
          >
            {loadingIndex === index ? (
              <div className="w-6 h-6">
                <LoadingSpinner />
              </div>
            ) : chord ? (
              selectedKey === "C" ? (
                chord.display
              ) : (
                transposeChord(chord.display, "C", selectedKey)
              )
            ) : (
              "?"
            )}
          </button>
        ))}
      </div>

      {progression.every((chord) => chord) && (
        <div className="flex gap-2">
          <button
            onClick={playProgression}
            disabled={isPlaying || !audioInitialized}
            className={`px-4 py-2 text-white rounded ${
              isPlaying || !audioInitialized
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Play Loop
          </button>

          <button
            onClick={stopProgression}
            disabled={!isPlaying || !audioInitialized}
            className={`px-4 py-2 text-white rounded ${
              !isPlaying || !audioInitialized
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Stop
          </button>
        </div>
      )}
    </div>
  );
}
