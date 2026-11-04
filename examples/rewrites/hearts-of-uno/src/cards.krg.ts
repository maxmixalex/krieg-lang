/** A physical 108-card deck described by its rules, not a copied flag dictionary. */
export const colors = [
  { name: "red", id: 1 },
  { name: "blue", id: 2 },
  { name: "yellow", id: 3 },
  { name: "green", id: 4 },
] as const;
export const ranks = [
  { name: "0", id: 0 },
  { name: "1", id: 1 },
  { name: "2", id: 2 },
  { name: "3", id: 3 },
  { name: "4", id: 4 },
  { name: "5", id: 5 },
  { name: "6", id: 6 },
  { name: "7", id: 7 },
  { name: "8", id: 8 },
  { name: "9", id: 9 },
  { name: "block", id: 10 },
  { name: "reverse", id: 11 },
  { name: "plus", id: 12 },
] as const;
export interface Card {
  id: number;
  color: number;
  rank: number;
  face: string;
}
export const cards: readonly Card[] = [
  ...colors.flatMap((color, colorIndex) =>
    ranks.flatMap((rank) =>
      (rank.id === 0 ? [1] : [1, 2]).map((copy) => ({
        id: colorIndex * 25 + (rank.id === 0 ? 1 : rank.id * 2) + copy - 1,
        color: color.id,
        rank: rank.id,
        face: `${color.name}_${rank.name}`,
      })),
    ),
  ),
  ...[
    { name: "wild_color", rank: 13 },
    { name: "wild_plus", rank: 14 },
  ].flatMap((wild, index) =>
    [1, 2, 3, 4].map((copy) => ({
      id: 100 + index * 4 + copy,
      color: 0,
      rank: wild.rank,
      face: wild.name,
    })),
  ),
];
export const faces = [
  ...colors.flatMap((color) =>
    ranks.map((rank) => ({ color: color.id, rank: rank.id, name: `${color.name}_${rank.name}` })),
  ),
  { color: 0, rank: 13, name: "wild_color" },
  { color: 0, rank: 14, name: "wild_plus" },
];
export const seats = [1, 2, 3, 4, 5, 6] as const;
export const guestSeats = [2, 3, 4, 5, 6] as const;
