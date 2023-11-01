import { cfg } from "../config";
import { Coord } from "../types";

export const copy = <T>(val: T) => JSON.parse(JSON.stringify(val));

export function assertEventTarget<Element extends Function>(
  event: any,
  element: Element //@ts-ignore
): asserts event is (Omit<Event, 'target'> & { target: InstanceType<Element> }) {
  if (event.target && event.target instanceof element) {
    return;
  }

  throw Error(`Target is not instance of ${element}`);
};

export const doNothing = <T = any>() => (val: string) => val as T;

export const voidExecutor = (...fns: (() => void)[]) => () => fns.forEach(fn => fn());

export const getCellCoord = (
  e: MouseEvent,
): Coord => {
  const gridWidth = cfg.drawGrid ? cfg.gridWidth : 0;
  const x = ~~(e.offsetX / (cfg.cellSize + gridWidth));
  const y = ~~(e.offsetY / (cfg.cellSize + gridWidth));

  return {x, y}
};

export const toggleCell = ({x, y}: Coord, alive?: boolean) => {
  if (y === cfg.verCount) {
    return;
  }

  cfg.field[y][x] = alive === undefined ? !cfg.field[y][x] : alive;
}