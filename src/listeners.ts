import { canvas, drawGame, game } from "./game";
import { input } from "./input";
import { getCellCoord, toggleCell } from "./utils/common";

export const addListeners = () => {
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
    if (!mouseMoveCount) {
      toggleCell(getCellCoord(e));
      drawGame();
    }
    mouseMoveCount = 0;
  });

  input.startListening();
  
  input.addListener("toggleStop", () => {
    game.isRunning ? game.stop?.() : game.start();
  });
};
