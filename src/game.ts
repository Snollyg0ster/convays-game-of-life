import { Cell } from "./types";
import { cfg } from "./config";
import { renderCells, renderGrid } from "./render";
import { createCanvas } from "./elements";
import { getCellCoord, toggleCell } from "./utils";

export const { canvas, canvasCont, updateCanvasStyle, changeCanvasColor } = createCanvas();
export const drawGame = () => renderCells(canvas.game.ctx, cfg.field);
export const drawGrid = () => cfg.cellSize > 1 && cfg.drawGrid && renderGrid(canvas.grid.ctx);

const uiCanvas = canvas.ui.el;
let mouseMoveCount = 0;
const onMouseMove = (e: MouseEvent) => {
  mouseMoveCount += 1;
  toggleCell(getCellCoord(e), true);
  drawGame();
};

uiCanvas.addEventListener("mousedown", () => {
  uiCanvas.addEventListener("mousemove", onMouseMove);
});

uiCanvas.addEventListener("mouseup", (e) => {
  uiCanvas.removeEventListener("mousemove", onMouseMove);
  if(!mouseMoveCount) {
    toggleCell(getCellCoord(e))
    drawGame();
  };
  mouseMoveCount = 0;
});

const getIndex = (len: number, pos: number) =>
  pos > len ? 0 : pos < 0 ? len : pos;

const getNeighbours = (field: Cell[][], x: number, y: number) => {
  let neighbours = field[y][x] ? -1 : 0;
  const bottom = y + 2,
    right = x + 2,
    fieldLen = field.length - 1;

  for (let i = y - 1; i < bottom; i++) {
    const row = field[getIndex(fieldLen, i)];
    const rowLen = row.length - 1;

    for (let j = x - 1; j < right; j++) {
      const neighbour = row[getIndex(rowLen, j)];

      neighbours += neighbour ? 1 : 0;
    }
  }

  return neighbours;
};

export const game = (field: Cell[][]) => {
  const newField: Cell[][] = cfg.initField;
  cfg.prevField = field;

  for (let y = 0; y < field.length; y++) {
    const row = newField[y];

    for (let x = 0; x < row.length; x++) {
      const neighbours = getNeighbours(cfg.prevField, x, y);

      if (!cfg.prevField[y][x]) {
        if (neighbours === 3) {
          row[x] = true;
        }
      } else {
        if (neighbours > 3 || neighbours < 2) {
          row[x] = false;
        } else {
          row[x] = true;
        }
      }
    }
  }

  return newField;
};

export const nextFrame = () => {
  cfg.field = game(cfg.field);
  drawGame();
};

export const startGame = () => {
  let lastRender = performance.now();
  let run = true;

  const loop = (delta: number) => {
    if (!run) {
      return;
    }

    const rerenderTime = lastRender + cfg.interval;

    if (delta >= rerenderTime) {
      nextFrame();
      lastRender = delta - (delta - rerenderTime);
    }

    requestAnimationFrame(loop);
  };

  loop(performance.now());
  return () => {
    run = false;
  };
};
