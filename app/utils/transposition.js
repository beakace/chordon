const notes = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const transposeNote = (note, fromKey = "C", toKey = "C") => {
  console.log("Transposing note:", { note, fromKey, toKey });

  // If keys are the same, return original note
  if (fromKey === toKey) return note;

  // Handle notes with and without octaves
  const hasOctave = /^([A-G][b♭]?)(\d+)$/.test(note);
  const pitch = hasOctave ? note.match(/([A-G][b♭]?)/)[1] : note;
  const octave = hasOctave ? note.match(/(\d+)$/)[1] : null;

  console.log("Parsed note:", { pitch, octave, hasOctave });

  // Convert any ♭ to b for consistency
  const normalizedPitch = pitch.replace("♭", "b");

  // Calculate semitone difference
  const fromIndex = notes.indexOf(fromKey);
  const toIndex = notes.indexOf(toKey);
  const semitones = toIndex - fromIndex;

  console.log("Semitone calculation:", { fromIndex, toIndex, semitones });

  // Find new pitch
  let noteIndex = notes.indexOf(normalizedPitch);
  let newIndex = (noteIndex + semitones + 12) % 12;
  let octaveShift = Math.floor((noteIndex + semitones) / 12);

  console.log("New pitch calculation:", { noteIndex, newIndex, octaveShift });

  // Get the new note name
  const newPitch = notes[newIndex];

  // If the original note had an octave, include it in the result
  if (octave !== null) {
    const newOctave = parseInt(octave) + octaveShift;
    return newPitch + newOctave;
  }

  // For display purposes (chord names), use ♭ instead of b
  return newPitch.replace("b", "♭");
};

export const transposeChord = (chord, fromKey = "C", toKey = "C") => {
  console.log("Transposing chord:", { chord, fromKey, toKey });

  if (fromKey === toKey) return chord;

  // Handle slash chords
  if (chord.includes("/")) {
    const [baseChord, bassNote] = chord.split("/");
    return `${transposeChord(baseChord, fromKey, toKey)}/${transposeNote(
      bassNote,
      fromKey,
      toKey
    )}`;
  }

  // Extract root and quality (e.g., "C" and "m7" from "Cm7")
  const match = chord.match(/^([A-G][b♭]?)(.*)$/);
  if (!match) {
    console.log("No match found for chord:", chord);
    return chord;
  }

  const [, root, quality] = match;
  const newRoot = transposeNote(root, fromKey, toKey);
  const result = newRoot + quality;

  console.log("Final transposed chord:", result);
  return result;
};

export const transposeNotes = (notes, fromKey = "C", toKey = "C") => {
  console.log("Transposing notes array:", { notes, fromKey, toKey });

  if (fromKey === toKey) return notes;

  const result = notes.map((note) => transposeNote(note, fromKey, toKey));
  console.log("Transposed notes array:", result);

  return result;
};
