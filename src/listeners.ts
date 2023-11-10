import { cfg } from "./config";
import { canvas, clearSelection, drawGame, game } from "./game";
import { input } from "./input";
import { renderUi } from "./render";
import { Coord } from "./types";
import { clearFieldSelection, getCellCoord, getSelectionField, pasteFieldTo, toggleCell } from "./utils/field";

export const addListeners = () => {
  const uiCanvas = canvas.ui.el;
  let mouseMoveCount = 0;
  let mouseDown = false;
  let cellCoord: Coord | undefined;
  let pasteField: boolean[][] | undefined;
  
  const onMouseMove = (e: MouseEvent) => {
    cellCoord = getCellCoord(e, cfg);

    const selectPressed = input.isAliasPressed('select');

    if (selectPressed && mouseDown) {
      cfg.setSelection(cellCoord);
    }

    renderUi(canvas.ui.ctx, cellCoord, selectPressed);
    
    if (mouseDown && !selectPressed) {
      mouseMoveCount += 1;
      const isCellChanged = toggleCell(cfg.field, getCellCoord(e, cfg), cfg, true);
      isCellChanged && drawGame();
      return
    }
  };

  uiCanvas.addEventListener("mousedown", () => {
    cfg.setSelection(null);
    renderUi(canvas.ui.ctx);
    mouseDown = true;
  });
  uiCanvas.addEventListener("mouseup", (e) => {
    if (!mouseMoveCount && !input.isAliasPressed('select')) {
      toggleCell(cfg.field, getCellCoord(e, cfg), cfg);
      drawGame();
    }
    mouseMoveCount = 0;
    mouseDown = false;
  });
  uiCanvas.addEventListener("mouseleave", () => {
    mouseDown = false;
  });
  uiCanvas.addEventListener("mousemove", onMouseMove);

  input.startListening();
  input.addAliasListener("toggleStop", () => {
    game.isRunning ? game.stop?.() : game.start();
  });
  input.addShortcutListener('copy', () => {
    if (cfg.selection) {
      pasteField = getSelectionField(cfg.field, cfg.selection);
      cfg.setSelection(null);
      renderUi(canvas.ui.ctx);
    }
  });
  input.addShortcutListener('paste', () => {
    if (pasteField && cellCoord) {
      pasteFieldTo(pasteField, cellCoord, cfg)
      drawGame();
      cfg.setSelection(null);
      renderUi(canvas.ui.ctx);
    }
  });
  input.addShortcutListener('clear', () => {
    clearSelection();
    drawGame();
  });
  input.addShortcutListener('cut', () => {
    if (cfg.selection) {
      pasteField = getSelectionField(cfg.field, cfg.selection);
      clearFieldSelection(cfg.field, cfg.selection)
      cfg.setSelection(null);
      drawGame();
      renderUi(canvas.ui.ctx);
    }
  });
};
