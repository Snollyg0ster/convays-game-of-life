import { cfg } from "./config";
import {
  createGameButton,
  createCbButton,
  createGameSpeedSlider,
  createNumberInput,
  createColorInput,
  createCheckbox
} from "./elements";
import { drawCells } from "./dom";
import {
  BACKGROUND_COLOR_TEXT,
  CELL_COLOR_TEXT,
  CLEAR_TEXT,
  DENCITY_TEXT,
  EXAMPLE_TEXT,
  GRID_TEXT,
  NEXT_FRAME_TEXT,
  RANDOM_TEXT
} from "./consts";
import { preloadedField } from "./defaults";
import { startGame, nextFrame, ctx, updateCanvasStyle } from "./game";

export const buttonCont = document.createElement("div");
export const root = document.getElementById("root");

const gameButton = createGameButton(startGame);
const nextFrameButton = createCbButton(NEXT_FRAME_TEXT, nextFrame);
const clearButton = createCbButton(CLEAR_TEXT, () => {
  cfg.resetField();
  drawCells(ctx, cfg.field);
});
const gameSpeed = createGameSpeedSlider();

const verSizeInput = createNumberInput(
  "Размер по вертикали",
  "verCount",
  () => {
    cfg.resetField();
    updateCanvasStyle();
    drawCells(ctx, cfg.field);
  }
);
const horSizeInput = createNumberInput(
  "Размер по горизонтали",
  "horCount",
  () => {
    cfg.resetField();
    updateCanvasStyle();
    drawCells(ctx, cfg.field);
  }
);
const cellSizeInput = createNumberInput(
  "Размер клетки (px)",
  "cellSize",
  () => {
    updateCanvasStyle();
    drawCells(ctx, cfg.field);
  }
);

const drawGridButton = createCheckbox(GRID_TEXT, "drawGrid", () => {
  updateCanvasStyle();
  drawCells(ctx, cfg.field);
});

const logFunction = () => console.log(cfg.field);
const logButton = createCbButton("log", logFunction);

const drawExampleField = () => {
  cfg.resetField();
  cfg.verCount = 50;
  cfg.horCount = 50;
  cfg.cellSize = 10;
  cfg.gameDeltaTime = 50;
  cfg.field = preloadedField;
  updateCanvasStyle();
  drawCells(ctx, cfg.field);
};
const exampleButton = createCbButton(EXAMPLE_TEXT, drawExampleField);

const backgroundColor = createColorInput(
  BACKGROUND_COLOR_TEXT,
  "backgroundColor",
  updateCanvasStyle
);
const cellColor = createColorInput(CELL_COLOR_TEXT, "cellColor", () =>
  drawCells(ctx, cfg.field)
);
const colorCont = document.createElement("div");
colorCont.classList.add("row");
colorCont.append(backgroundColor, cellColor);

const randomlyFillField = () => {
  const dencity = cfg.dencityOfRandomFill;
  const randomField = cfg.initField;
  console.log("dencity", dencity);
  cfg.field = randomField
    .map((row) => row.fill(false))
    .map((row) => row.map(() => Math.random() < dencity));
  drawCells(ctx, cfg.field);
};
const randomButton = createCbButton(RANDOM_TEXT, randomlyFillField);
const randomDencityButton = createNumberInput(
  DENCITY_TEXT,
  "dencityOfRandomFill",
  undefined,
  {
    min: 0.01,
    max: 1,
    float: true
  }
);
const randomFillCont = document.createElement("div");
randomFillCont.classList.add("row");
randomFillCont.append(randomButton, randomDencityButton);

buttonCont.classList.add("buttons");
buttonCont.append(
  gameButton,
  nextFrameButton,
  clearButton,
  gameSpeed,
  verSizeInput,
  horSizeInput,
  cellSizeInput,
  drawGridButton,
  colorCont,
  randomFillCont,
  logButton,
  exampleButton
);
