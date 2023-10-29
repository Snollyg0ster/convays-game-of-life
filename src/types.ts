export type Cell = boolean;

export type NumberFields =
  | "cellSize"
  | "horCount"
  | "verCount"
  | "gameDeltaTime"
  | "dencityOfRandomFill";

export type ColorFields =
  | "backgroundColor"
  | "cellColor"
  | "gridColor"
  | "cursorColor";

export interface Coord {
  x: number;
  y: number;
}

export interface NumberInputProps {
  min?: number;
  max?: number;
  float?: boolean;
}

//TODO понять почему не работает
type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
export type PickKeysOfType<V, T> = {
  [key in keyof V]-?: V[key] extends T ? key : never;
}[keyof V];
