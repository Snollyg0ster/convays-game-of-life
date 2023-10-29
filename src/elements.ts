import { START_TEXT, STOP_TEXT, SPEED_TEXT } from "./consts";
import { cfg } from "./config";
import { trackMouse } from "./dom";
import { ColorFields, NumberFields, NumberInputProps } from "./types";
import { assertEventTarget } from "./utils";

export const createCanvas = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.classList.add("canvas");
  canvas.width = cfg.gameWidth;
  canvas.height = cfg.gameHeight;
  let mouseMoveCount = 0;
  const onMouseMove = (e: MouseEvent) => {
    mouseMoveCount += 1;
    trackMouse(e, ctx, true);
  };

  canvas.addEventListener("mousedown", () => {
    canvas.addEventListener("mousemove", onMouseMove);
  });

  canvas.addEventListener("mouseup", (e) => {
    canvas.removeEventListener("mousemove", onMouseMove);
    !mouseMoveCount && trackMouse(e, ctx);
    mouseMoveCount = 0;
  });

  const updateCanvasStyle = () => {
    canvas.height = cfg.gameHeight;
    canvas.width = cfg.gameWidth;
    canvas.setAttribute(
      "style",
      `width: ${cfg.gameWidth}px;
        height: ${cfg.gameHeight}px;
        background: ${cfg.backgroundColor};`
    );
  };

  updateCanvasStyle();

  return { canvas, ctx, updateCanvasStyle };
};

export const createGameButton = (cb: () => () => void, isRuning = false) => {
  const gameButton = document.createElement("button");
  gameButton.textContent = isRuning ? STOP_TEXT : START_TEXT;
  let stopGame: () => void;

  gameButton.onclick = () => {
    isRuning = !isRuning;
    gameButton.textContent = isRuning ? STOP_TEXT : START_TEXT;

    if (isRuning) {
      stopGame = cb();
    } else {
      stopGame?.();
    }
  };

  return gameButton;
};

export const createCbButton = (title: string, cb: () => void) => {
  const button = document.createElement("button");

  button.textContent = title;
  button.onclick = cb;

  return button;
};

export const createGameSpeedSlider = (min = 1, max = 1000, normal = 100) => {
  const cont = document.createElement("div");
  const label = document.createElement("label");
  cont.classList.add("col");
  label.textContent = `${SPEED_TEXT} ${(cfg.gameDeltaTime / 1000).toFixed(2)}`;
  label.setAttribute("for", "gameSpeed");
  const input = document.createElement("input");
  input.setAttribute("value", `${cfg.gameDeltaTime}`);
  input.setAttribute("min", `${min}`);
  input.setAttribute("max", `${max}`);
  input.type = "range";
  cont.append(label, input);

  input.oninput = (e) => {
    assertEventTarget(e, HTMLInputElement);
    const speed = +e.target.value;
    cfg.gameDeltaTime = speed;
    const precision = speed > 100 ? 1 : speed < 10 ? 3 : 2;
    label.textContent = `${SPEED_TEXT} ${(speed / 1000).toFixed(precision)}`;
  };

  return cont;
};

export const createNumberInput = (
  title: string,
  field: NumberFields,
  cb?: (val: number) => void,
  props: NumberInputProps = {}
) => {
  const { min = 1, max = 1000, float = false } = props;
  const cont = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = title;
  cont.classList.add("col");
  const input = document.createElement("input");
  input.setAttribute("value", `${cfg[field]}`);
  input.type = "number";
  cont.append(label, input);

  cfg.observe(field, (val) => {
    input.value = `${val}`;
  });

  input.oninput = (e) => {
    assertEventTarget(e, HTMLInputElement);
    const num = float
      ? parseFloat(e.target.value)
      : ~~parseFloat(e.target.value);
    const val = num < min ? min : num > max ? max : num;
    cfg[field] = val;
    cb?.(val);
  };

  return cont;
};

export const createColorInput = (
  title: string,
  field: ColorFields,
  cb?: (val: string) => void
) => {
  const cont = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = title;
  cont.classList.add("col");
  const input = document.createElement("input");
  input.setAttribute("value", `${cfg[field]}`);
  input.type = "color";
  cont.append(label, input);

  input.oninput = (e) => {
    assertEventTarget(e, HTMLInputElement);
    const color = e.target.value;
    cfg[field] = color;
    cb?.(color);
  };

  return cont;
};

export const createCheckbox = (
  title: string,
  field: "drawGrid",
  cb?: () => void
) => {
  const cont = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = title;
  const input = document.createElement("input");
  cfg[field] && input.setAttribute("checked", "");
  input.type = "checkbox";
  cont.append(label, input);

  input.onclick = () => {
    cfg[field] = !cfg[field];
    cb?.();
  };

  return cont;
};
