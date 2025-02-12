export const allChords = [
  { original: "I", display: "C" },
  { original: "ii", display: "Dm" },
  { original: "iii", display: "Em" },
  { original: "IV", display: "F" },
  { original: "V", display: "G" },
  { original: "vi", display: "Am" },
  { original: "vii°", display: "B°" },
];

export const getChordNotes = (chord) => {
  const cleanChord = chord.replace(/<[^>]*>/g, "");

  const chordMap = {
    I: ["C3", "G3", "C4", "G4", "C5"],
    ii: ["D3", "A3", "D4", "C4", "C5"],
    iii: ["E3", "C3", "C4", "G4", "C5"],
    IV: ["F3", "C4", "F4", "G4", "C5"],
    V: ["G3", "D4", "G4", "G4", "C5"],
    vi: ["A3", "E4", "A4", "C5"],
    "vii°": ["B3", "C4", "B4", "C5"],
    27: ["D3", "F3", "A3", "C4"],
    47: ["F3", "A3", "C4", "E4"],
    57: ["G3", "B3", "D4", "F4"],
    67: ["A3", "C4", "E4", "G4"],
    37: ["E3", "G3", "B3", "D4"],
    17: ["C3", "E3", "G3", "B3"],
    16: ["C3", "E3", "G3", "A3"],
    36: ["E3", "G3", "B3", "C4"],
    46: ["F3", "A3", "C4", "D4"],
    66: ["A3", "C4", "E4", "F4"],
    "5/6": ["G3", "B3", "D4", "A3"],
    "57/6": ["G3", "B3", "D4", "F4", "A3"],
    "5/5": ["G3", "B3", "D4", "G2"],
    164: ["G3", "C4", "E4"],
    464: ["C4", "F4", "A4"],
    564: ["D4", "G4", "B4"],
    664: ["E4", "A4", "C5"],
    b7: ["B3", "D4", "F4"],
    b6: ["A3", "C4", "E4"],
    b3: ["E3", "G3", "B3"],
    642: ["A3", "C4", "E4", "D3"],
    vi42: ["D3", "A3", "C4", "F4"],
    "vi<sup>4</sup><sub>2</sub>": ["D3", "A3", "C4", "F4"],
    "vi<sup>4</sup>2": ["D3", "A3", "C4", "F4"],
    642: ["D3", "A3", "C4", "F4"],
  };

  return chordMap[cleanChord] || chordMap["I"];
};

export const getBaseChord = (romanNumeral) => {
  const clean = romanNumeral.replace(/<[^>]*>/g, "");
  const baseChord = clean.split("/")[0];

  if (baseChord === "I") return "I";
  if (baseChord === "ii") return "ii";
  if (baseChord === "iii") return "iii";
  if (baseChord === "IV") return "IV";
  if (baseChord === "V") return "V";
  if (baseChord === "vi") return "vi";
  if (baseChord === "vii°") return "vii°";

  return "I";
};

export const getRealChordName = (romanNumeral) => {
  const clean = romanNumeral.replace(/<[^>]*>/g, "");

  const chordNames = {
    I: "C",
    ii: "Dm",
    iii: "Em",
    IV: "F",
    V: "G",
    vi: "Am",
    "vii°": "B°",
  };

  return chordNames[clean] || romanNumeral;
};

export const getAdvancedChordName = (chordHTML) => {
  // Create a temporary element to decode HTML entities
  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // First decode all HTML entities
  const decodedHTML = decodeHTML(chordHTML);

  // Special case handling for complex chords
  const specialCases = {
    vi42: "Am6/4/D",
    "vi<sup>4</sup><sub>2</sub>": "Am6/4/D",
    "vi<sup>4</sup>2": "Am6/4/D",
    642: "Am6/4/D",
  };

  // Check for special cases first
  for (const [pattern, replacement] of Object.entries(specialCases)) {
    if (decodedHTML.includes(pattern) || chordHTML.includes(pattern)) {
      return replacement;
    }
  }

  // Remove HTML tags but keep superscript content
  const clean = decodedHTML.replace(/<(?!\/?sup)[^>]+>/g, "");

  // Convert Roman numerals to actual chord names (in C major)
  const romanToChord = {
    I: "C",
    II: "D",
    III: "E",
    IV: "F",
    V: "G",
    VI: "A",
    VII: "B",
    i: "Cm",
    ii: "Dm",
    iii: "Em",
    iv: "Fm",
    v: "Gm",
    vi: "Am",
    vii: "Bm",
    "vii°": "B°",
    viiø: "Bø",
    "♭VII": "B♭",
    "♭II": "D♭",
    "♭III": "E♭",
    "♭VI": "A♭",
    bVII: "B♭",
    bII: "D♭",
    bIII: "E♭",
    bVI: "A♭",
    b7: "B♭",
    b6: "A♭",
    b3: "E♭",
  };

  // Handle inversions and additional symbols
  let chord = clean;
  let inversion = "";
  let additional = "";

  // Extract inversion if present
  if (chord.includes("/")) {
    [chord, inversion] = chord.split("/");
  }

  // Handle superscript (e.g., 7, maj7, etc.)
  if (chord.includes("<sup>")) {
    chord = chord.replace(/<sup>(.*?)<\/sup>/g, (match, p1) => {
      additional = p1;
      return "";
    });
  }

  // Get the base chord
  let baseName = romanToChord[chord] || chord;

  // Add the additional information
  if (additional) {
    // Transform common chord extensions
    const extensions = {
      7: "7",
      maj7: "maj7",
      min7: "m7",
      dim7: "dim7",
      ø7: "ø7",
      6: "6",
      sus4: "sus4",
      "6/4": "6/4",
      42: "6/4/D",
      // Add more extensions as needed
    };
    baseName += extensions[additional] || additional;
  }

  // Add the inversion
  if (inversion) {
    baseName += `/${romanToChord[inversion] || inversion}`;
  }

  return baseName;
};
