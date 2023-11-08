export type Cell = boolean;

export type NumberFields =
  | "speed"
  | "cellSize"
  | "horCount"
  | "verCount"
  | "interval"
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

export type Selection = Record<'start' | 'end' | 'center', CellCoord>;

export interface CellCoord extends Coord {};

export interface InputElements {
  cont: HTMLDivElement;
  label: HTMLLabelElement;
  input: HTMLInputElement;
}

export interface InputProps<T>  {
  type?: string;
  hor?: boolean;
  attrs?: Indexed;
  labelClass?: string;
  inputClass?: string;
  contClass?: string;
  onChange?: (val: string, props: InputProps<T> & InputElements) => void;
  format?: (val: T) => string;
  parse?: (val: string) => T;
}

export interface InputPropsStrictParse<T> extends Omit<InputProps<T>, 'parse'> {
  parse: (val: string) => T;
}

export interface NumberInputProps {
  min?: number;
  max?: number;
  float?: boolean;
  onChange?: (val: string, props?: InputProps<number> & InputElements) => void;
}

//TODO понять почему не работает
type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
export type PickKeysOfType<V, T> = {
  [key in keyof V]-?: V[key] extends T ? key : never;
}[keyof V];
type KeysOmit<T, V> = {
  [K in keyof T]-?: T[K] extends V ? never : K;
}[keyof T];

const jd: KeysOmit<NumberInputProps, number> = 'float'
