import { useState, useCallback } from "react";
import * as Tone from "tone";

export function useAudioInitialization() {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [synth, setSynth] = useState(null);

  const initializeAudio = useCallback(async () => {
    await Tone.start();

    // REVERB
    // decay: 0.1 to 10 seconds (how long the reverb tail lasts)
    // preDelay: 0 to 1 seconds (delay before reverb starts)
    // wet: 0 to 1 (mix amount, 0 = dry, 1 = fully wet)
    const reverb = new Tone.Reverb({
      decay: 10,
      preDelay: 0.1,
      wet: 0.4,
    }).toDestination();

    // VIBRATO
    // frequency: 0.1 to 20 Hz (speed of vibrato)
    // depth: 0 to 1 (intensity of pitch variation)
    const vibrato = new Tone.Vibrato({
      frequency: 7,
      depth: 0.03,
      type: "sine",
    });

    // CHORUS
    // frequency: 0.1 to 10 Hz (speed of chorus)
    // delayTime: 2 to 20 ms (delay between voices)
    // depth: 0 to 1 (intensity)
    // spread: 0 to 180 degrees (stereo width)
    const chorus = new Tone.Chorus({
      frequency: 3,
      delayTime: 3.5,
      depth: 0.1,
      spread: 180,
    }).start();

    // PING PONG DELAY
    // delayTime: any note value ("8n", "4n", etc) or time in seconds
    // feedback: 0 to 0.99 (amount of repeats)
    // wet: 0 to 1 (mix amount)
    const delay = new Tone.PingPongDelay({
      delayTime: "8n",
      feedback: 0.2,
      wet: 0.4,
    });

    // EQ3
    // low/mid/high: -60 to +12 dB (boost/cut for each band)
    // lowFrequency: 20 to 1000 Hz (crossover between low/mid)
    // highFrequency: 1000 to 20000 Hz (crossover between mid/high)
    const eq = new Tone.EQ3({
      low: -3,
      mid: 0,
      high: -3,
      lowFrequency: 250,
      highFrequency: 2500,
    });

    // FILTER
    // type: "lowpass", "highpass", "bandpass", etc
    // frequency: 20 to 20000 Hz (cutoff frequency)
    // rolloff: -12, -24, -48, -96 (dB per octave)
    // Q: 0.1 to 20 (resonance at cutoff)
    const filter = new Tone.Filter({
      type: "lowpass",
      frequency: 5000,
      rolloff: -12,
      Q: 1,
    });

    // COMPRESSOR
    // threshold: -100 to 0 dB (level where compression starts)
    // ratio: 1 to 20 (amount of compression)
    // attack: 0 to 1 seconds (how fast compression starts)
    // release: 0 to 1 seconds (how fast compression stops)
    const compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 12,
      attack: 0.003,
      release: 0.25,
    }).toDestination();

    const reverb2 = new Tone.Reverb({
      decay: 10,
      preDelay: 0.1,
      wet: 1,
    }).toDestination();

    // SYNTH
    // oscillator.type: "sine", "square", "triangle", "sawtooth" (+ variations like "sine8")
    // envelope parameters: 0 to 2 seconds typically
    const newSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "triangle8",
        partials: [1, 0.5, 0.3],
      },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.3,
        release: 1.5,
      },
      volume: -20,
    });

    // Connect everything in the effects chain
    newSynth.chain(
      vibrato,
      chorus,
      eq,
      filter,
      delay,
      reverb,
      compressor,
      reverb2
    );

    setSynth(newSynth);
    setAudioInitialized(true);
  }, []);

  return { synth, audioInitialized, initializeAudio };
}
