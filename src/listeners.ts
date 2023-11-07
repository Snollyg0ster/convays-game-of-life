import { cfg } from "./config";
import { canvas, drawGame, game } from "./game";
import { input } from "./input";
import { renderUi } from "./render";
import { Coord } from "./types";
import { getCellCoord, toggleCell } from "./utils/common";

export const addListeners = () => {
  const uiCanvas = canvas.ui.el;
  let mouseMoveCount = 0;
  let mouseDown = false;
  let cellCoord: Coord;
  
  const onMouseMove = (e: MouseEvent) => {
    const prevCoord = cellCoord;
    cellCoord = getCellCoord(e);

    if (prevCoord?.x === cellCoord.x && prevCoord?.y === cellCoord.y) {
      return;
    }

    const selectPressed = input.getPressed('select');

    if (selectPressed && mouseDown) {
      cfg.setSelection(cellCoord);
    }

    renderUi(canvas.ui.ctx, cellCoord, selectPressed);
    
    if (mouseDown && !selectPressed) {
      mouseMoveCount += 1;
      const isCellChanged = toggleCell(getCellCoord(e), true);
      isCellChanged && drawGame();
      return
    }
  };

  uiCanvas.addEventListener("mousedown", () => {
    if (!input.getPressed('select')) {
      cfg.setSelection(null);
      renderUi(canvas.ui.ctx, cellCoord);
    }
    mouseDown = true;
  });
  uiCanvas.addEventListener("mouseup", (e) => {
    if (!mouseMoveCount && !input.getPressed('select')) {
      toggleCell(getCellCoord(e));
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
  input.addListener("toggleStop", () => {
    game.isRunning ? game.stop?.() : game.start();
  });
};
