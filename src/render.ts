import { Cell, Coord } from "./types";
import { cfg } from "./config";

export const clearCtx = (ctx: CanvasRenderingContext2D | null) =>
  ctx && ctx.clearRect(0, 0, cfg.gameWidth, cfg.gameHeight);

export function renderGrid(ctx: CanvasRenderingContext2D | null) {
  if (!ctx) {
    return;
  }

  clearCtx(ctx);

  for (let y = 1; y < cfg.verCount; y++) {
    const yPos = y * (cfg.cellSize + cfg.gridWidth) - cfg.gridWidth;
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
    const xPos = y * (cfg.cellSize + cfg.gridWidth) - cfg.gridWidth;
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

  for (let y = 0; y < field.length; y++) {
    const row = field[y];
    const yPos = y * (cfg.cellSize + gridWidth);

    for (let x = 0; x < row.length; x++) {
      const xPos = x * (cfg.cellSize + gridWidth);
      const cell = row[x];

      if (!cell) {
        continue;
      }

      ctx.fillRect(xPos, yPos, cfg.cellSize, cfg.cellSize);
    }
  }
}
