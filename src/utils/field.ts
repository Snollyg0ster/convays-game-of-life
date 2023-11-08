import Config from "../config";
import { CellCoord, Coord, Selection } from "../types";

export const getCellCoord = (
  e: MouseEvent,
  options: Pick<Config, "drawGrid" | "cellSize" | "gridWidth">
): Coord => {
  const gridWidth = options.drawGrid ? options.gridWidth : 0;
  const x = ~~(e.offsetX / (options.cellSize + gridWidth));
  const y = ~~(e.offsetY / (options.cellSize + gridWidth));

  return { x, y };
};

export const toggleCell = (
  field: boolean[][],
  { x, y }: CellCoord,
  options: Pick<Config, "verCount">,
  alive?: boolean
) => {
  if (y === options.verCount) {
    return;
  }

  const prevCellValue = field[y][x];

  field[y][x] = alive === undefined ? !field[y][x] : alive;

  const isCellChange = prevCellValue !== field[y][x];

  return isCellChange;
};

export const getSelectionField = (field: boolean[][], selection: Selection) => {
    const selectionField: boolean[][] = [];
    const yStart = selection.start.y, yEnd = selection.end.y;
    const xStart = selection.start.x, xEnd = selection.end.x;

    for (let y = yStart; y <= yEnd; y++) {
        const row: boolean[] = [];

        selectionField.push(row);

        for (let x = xStart; x <= xEnd; x++) {
            row[x - xStart] = field[y][x];
        }
    }

    return selectionField;
}

const getIndex = (len: number, pos: number) => pos < 0 ? len + pos % len : pos % len;

export const pasteFieldTo = (
  pastedField: boolean[][],
  cursor: CellCoord,
  options: Pick<Config, "field" | "horCount" | "verCount">
) => {
  const { field, horCount, verCount } = options;
  const selectionField: boolean[][] = [];
  const yStart = cursor.y;
  const xStart = cursor.x;
  const rowLength = pastedField.length;
  const columnLength = pastedField[0].length;

  for (let y = 0; y < rowLength; y++) {
    const row = field[getIndex(verCount, yStart + y)];

    for (let x = 0; x < columnLength; x++) {
      row[getIndex(horCount, xStart + x)] = pastedField[y][x];
    }
  }

  return selectionField;
};
