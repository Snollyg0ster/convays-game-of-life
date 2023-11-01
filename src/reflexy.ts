import { cfg } from "./config";
import { drawGame, drawGrid, updateCanvasStyle, changeCanvasColor } from "./game";
import { voidExecutor } from "./utils";

const updateCanvas = voidExecutor(updateCanvasStyle, drawGame, drawGrid);

export const reflexy = () => {
    cfg.observe('verCount', updateCanvas);
    cfg.observe('horCount', updateCanvas);
    cfg.observe('backgroundColor', changeCanvasColor);
    cfg.observe('cellSize', updateCanvas);
    cfg.observe('drawGrid', updateCanvas);
    cfg.observe('cellColor', drawGame);
    cfg.observe('gridColor', drawGrid);
}