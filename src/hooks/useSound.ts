"use client";

import { useCallback, useSyncExternalStore } from "react";
import { SOUND_STORAGE_KEY } from "@/lib/constants";

export type SoundKind = "draw" | "reveal" | "click";

type Tone = { frequency: number; endFrequency?: number; duration: number; delay?: number; wave: OscillatorType; gain: number };

/** Short synthesized cues — no audio files to download. */
const TONES: Record<SoundKind, Tone[]> = {
  draw: [{ frequency: 320, endFrequency: 760, duration: 0.16, wave: "triangle", gain: 0.12 }],
  reveal: [
    { frequency: 880, duration: 0.22, wave: "sine", gain: 0.1 },
    { frequency: 1320, duration: 0.28, delay: 0.07, wave: "sine", gain: 0.08 },
  ],
  click: [{ frequency: 1200, duration: 0.035, wave: "square", gain: 0.03 }],
};

const listeners = new Set<() => void>();

function readEnabled(): boolean {
  try {
    return window.localStorage.getItem(SOUND_STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

let memoryEnabled: boolean | null = null;

function getSnapshot() {
  return memoryEnabled ?? readEnabled();
}

function setEnabled(enabled: boolean) {
  memoryEnabled = enabled;
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Preference then lasts for this page only.
  }
  listeners.forEach((listener) => listener());
}

let audioContext: AudioContext | null = null;

function playTones(tones: Tone[]) {
  audioContext ??= new AudioContext();
  const ctx = audioContext;
  if (ctx.state === "suspended") void ctx.resume();

  for (const tone of tones) {
    const start = ctx.currentTime + (tone.delay ?? 0);
    const end = start + tone.duration;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = tone.wave;
    oscillator.frequency.setValueAtTime(tone.frequency, start);
    if (tone.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(tone.endFrequency, end);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(tone.gain, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  }
}

/** Sound effects, off by default; the preference is remembered per browser. */
export function useSound() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const play = useCallback(
    (kind: SoundKind) => {
      if (!enabled) return;
      try {
        playTones(TONES[kind]);
      } catch {
        // Web Audio unavailable — sound is optional.
      }
    },
    [enabled],
  );

  const toggle = useCallback(() => setEnabled(!getSnapshot()), []);

  return { enabled, toggle, play };
}
