import { AudioBank, indexBy } from "krieg-lang/hoi4";

/** The physical keyboard is a finite score; spacing and shortcuts are authored once per key. */
export const whiteKeys = [
  { note: "C1", shortcut: "z" },
  { note: "D1", shortcut: "x" },
  { note: "E1", shortcut: "c" },
  { note: "F1", shortcut: "v" },
  { note: "G1", shortcut: "b" },
  { note: "A1", shortcut: "n" },
  { note: "B1", shortcut: "m" },
  { note: "C2", shortcut: "q" },
  { note: "D2", shortcut: "w" },
  { note: "E2", shortcut: "e" },
  { note: "F2", shortcut: "r" },
  { note: "G2", shortcut: "t" },
  { note: "A2", shortcut: "y" },
  { note: "B2", shortcut: "u" },
  { note: "C3", shortcut: "i" },
] as const;
export const blackKeys = [
  { note: "Db1", shortcut: "s", after: 0 },
  { note: "Eb1", shortcut: "d", after: 1 },
  { note: "Gb1", shortcut: "g", after: 3 },
  { note: "Ab1", shortcut: "h", after: 4 },
  { note: "Bb1", shortcut: "j", after: 5 },
  { note: "Db2", shortcut: "2", after: 7 },
  { note: "Eb2", shortcut: "3", after: 8 },
  { note: "Gb2", shortcut: "5", after: 10 },
  { note: "Ab2", shortcut: "6", after: 11 },
  { note: "Bb2", shortcut: "7", after: 12 },
] as const;

export const piano = AudioBank("Piano", {
  path: "sound/piano_sound.asset",
  volume: 0.8,
  alwaysLoad: true,
  clips: indexBy(
    [...whiteKeys, ...blackKeys],
    (key) => `${key.note}_piano_note` as const,
    (key) => `piano/${key.note}_piano_note.wav` as const,
  ),
  compressor: {
    enabled: true,
    pregain: 3,
    postgain: 1,
    ratio: 2,
    threshold: -10,
    attacktime: 0.03,
    releasetime: 0,
  },
});
