import { cfg } from "./config";
import {
  createGameButton,
  createCbButton,
  createGameSpeedSlider,
  createNumberInput,
  createInput,
  createCheckbox,
} from "./elements";
import { drawCells } from "./render";
import {
  BACKGROUND_COLOR_TEXT,
  CELL_COLOR_TEXT,
  CLEAR_TEXT,
  DENCITY_TEXT,
  EXAMPLE_TEXT,
  GRID_COLOR_TEXT,
  GRID_TEXT,
  NEXT_FRAME_TEXT,
  RANDOM_TEXT,
} from "./consts";
import { preloadedField } from "./defaults";
import { startGame, nextFrame, ctx } from "./game";

const drawField = () => drawCells(ctx, cfg.field);
const resetField = () => {
  cfg.resetField();
  drawField();
};

export const buttonCont = document.createElement("div");
export const root = document.getElementById("root");

const gameButton = createGameButton(startGame);
const nextFrameButton = createCbButton(NEXT_FRAME_TEXT, nextFrame);
const clearButton = createCbButton(CLEAR_TEXT, () => {
  cfg.resetField();
  drawCells(ctx, cfg.field);
});
const gameSpeed = createGameSpeedSlider();

const verSizeInput = createNumberInput("Размер по вертикали", "verCount", {
  onChange: resetField,
});
const horSizeInput = createNumberInput("Размер по горизонтали", "horCount", {
  onChange: resetField,
});
const cellSizeInput = createNumberInput("Размер клетки (px)", "cellSize", {
  onChange: drawField,
});

const drawGridButton = createCheckbox(GRID_TEXT, "drawGrid", drawField);

const logFunction = () => console.log(cfg.field);
const logButton = createCbButton("log", logFunction);

const drawExampleField = () => {
  cfg.resetField();
  cfg.verCount = 50;
  cfg.horCount = 50;
  cfg.cellSize = 10;
  cfg.speed = 1;
  cfg.field = preloadedField;
  drawField();
};
const exampleButton = createCbButton(EXAMPLE_TEXT, drawExampleField);

const backgroundColor = createInput(BACKGROUND_COLOR_TEXT, "backgroundColor", {
  type: "color",
});
const cellColor = createInput(CELL_COLOR_TEXT, "cellColor", {
  type: "color",
  onChange: drawField,
});
const gridColor = createInput(GRID_COLOR_TEXT, "gridColor", {
  type: "color",
  onChange: drawField,
});
const colorCont = document.createElement("div");
colorCont.classList.add("row");
colorCont.append(backgroundColor, cellColor, gridColor);

const randomlyFillField = () => {
  const dencity = cfg.dencityOfRandomFill;
  const randomField = cfg.initField;

  cfg.field = randomField
    .map((row) => row.fill(false))
    .map((row) => row.map(() => Math.random() < dencity));
  drawCells(ctx, cfg.field);
};
const randomButton = createCbButton(RANDOM_TEXT, randomlyFillField);
const randomDencity = createInput(
  `${DENCITY_TEXT} ${~~(+cfg.dencityOfRandomFill * 100)}%`,
  "dencityOfRandomFill",
  {
    type: "range",
    attrs: {
      min: 0.01,
      max: 1,
      step: 0.01,
    },
    parse: (val) => +val,
    onChange: (val, { label }) =>
      (label.textContent = `${DENCITY_TEXT} ${~~(+val * 100)}%`),
  }
);
const randomFillCont = document.createElement("div");
randomFillCont.classList.add("row");
randomFillCont.append(randomButton, randomDencity);

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
