import { Cell, CellCoord, Coord } from "./types";
import { cfg } from "./config";

export const clearCtx = (ctx: CanvasRenderingContext2D | null) =>
  ctx && ctx.clearRect(0, 0, cfg.gameWidth, cfg.gameHeight);

export function renderGrid(ctx: CanvasRenderingContext2D | null) {
  if (!ctx) {
    return;
  }

  clearCtx(ctx);

  const unitSize = cfg.cellSize + cfg.gridWidth;

  for (let y = 1; y < cfg.verCount; y++) {
    const yPos = y * unitSize - cfg.gridWidth;
    const gameWidth = cfg.gameWidth;

    ctx.beginPath();
    ctx.strokeStyle = cfg.gridColor;
    ctx.lineWidth = cfg.gridWidth;
    ctx.moveTo(0, yPos);
    ctx.lineTo(gameWidth, yPos);
    ctx.stroke();
    ctx.closePath();
  }

  for (let y = 1; y < cfg.horCount; y++) {
    const xPos = y * unitSize - cfg.gridWidth;
    const gameHeight = cfg.gameHeight;

    ctx.beginPath();
    ctx.strokeStyle = cfg.gridColor;
    ctx.lineWidth = cfg.gridWidth;
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, gameHeight);
    ctx.stroke();
    ctx.closePath();
  }
}

export function renderCells(
  ctx: CanvasRenderingContext2D | null,
  field: Cell[][]
) {
  if (!ctx) {
    return;
  }
  
  clearCtx(ctx);
  ctx.fillStyle = cfg.cellColor;
  const gridWidth = cfg.drawGrid ? cfg.gridWidth : 0;
  const unitSize = cfg.cellSize + gridWidth;

  for (let y = 0; y < field.length; y++) {
    const row = field[y];
    const yPos = y * unitSize;

    for (let x = 0; x < row.length; x++) {
      const xPos = x * unitSize;
      const cell = row[x];

      if (!cell) {
        continue;
      }

      ctx.fillRect(xPos, yPos, cfg.cellSize, cfg.cellSize);
    }
  }
}

const getSelCoord = ({x: xA, y: yA}: CellCoord, {x: xB, y: yB}: CellCoord) => {
  const gridWidth = cfg.drawGrid ? cfg.gridWidth : 0;
  const unitSize = cfg.cellSize + gridWidth;
  const y = yA * unitSize;
  const x = xA * unitSize;
  const yEnd = yB * unitSize + unitSize - gridWidth;
  const xEnd = xB * unitSize + unitSize - gridWidth;

  return {x, y, xEnd, yEnd, width: xEnd - x, height: yEnd - y};
}

export const renderUi = (ctx: CanvasRenderingContext2D | null, coord?: CellCoord, selecting = false) => {
  if (!ctx) {
    return;
  }

  clearCtx(ctx);

  if (cfg.selection) {
    const {x, y, width, height} = getSelCoord(cfg.selection.start, cfg.selection.end);
    ctx.strokeStyle = cfg.selectionColor;
    ctx.strokeRect(x, y, width, height);
  }

  if (!coord || selecting) {
    return;
  }

  const {x, y, width, height} = getSelCoord(coord, coord);
  ctx.strokeStyle = cfg.cursorColor;
  ctx.strokeRect(x, y, width, height);
}