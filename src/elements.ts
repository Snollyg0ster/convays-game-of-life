import { START_TEXT, STOP_TEXT, SPEED_TEXT } from "./consts";
import Config, { cfg } from "./config";
import { trackMouse } from "./dom";
import {
  ColorFields,
  InputProps,
  InputPropsStrictParse,
  NumberFields,
  NumberInputProps,
} from "./types";
import { assertEventTarget, doNothing } from "./utils";

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

type ConfigKeys = Exclude<
  keyof InstanceType<typeof Config>,
  "resetField" | "observe" | "unsubscribe"
>;

export const createInput = <K extends ConfigKeys>(
  title: string,
  field: K,
  props: Config[K] extends string
    ? InputProps<Config[K]>
    : InputPropsStrictParse<Config[K]>
) => {
  const {
    type,
    hor = false,
    attrs = {},
    labelClass,
    inputClass,
    contClass,
    onChange,
    format,
    parse,
  } = props;
  const cont = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const onChangeProps = { ...props, cont, label, input };

  labelClass && label.classList.add(labelClass);
  inputClass && input.classList.add(inputClass);
  contClass && cont.classList.add(contClass);
  cont.classList.add(hor ? "row" : "col");
  type && (input.type = type);
  label.textContent = title;
  cont.append(label, input);

  Object.entries(attrs).forEach(
    ([key, val]) => val !== null && input.setAttribute(key, `${val}`)
  );
  input.setAttribute("value", format ? format(cfg[field]) : `${cfg[field]}`);

  cfg.observe(field, (val) => {
    input.value = format ? format(val) : `${val}`;
  });

  input.oninput = (e) => {
    assertEventTarget(e, HTMLInputElement);
    const val = parse ? parse(e.target.value) : e.target.value; //@ts-ignore
    cfg[field] = val;
    onChange?.(e.target.value, onChangeProps);
  };

  return cont;
};

export const createGameSpeedSlider = (min = -89, max = 200) => {
  const rangeToSpeed = (val: number) => val >= 10 ? val / 10 : 1 + (val - 10) * 0.01;
  const speedToRange = (val: number) => val >= 1 ? val * 10 : (val - 0.9) * 100;
  const getPrecision = (speed: number) => speed < 0.2 ? 2 : speed < 1 ? 1 : 0;

  const label = `${SPEED_TEXT} ${(cfg.speed).toFixed(getPrecision(cfg.speed))}`;
  const range = createInput(label, "speed", {
    type: "range",
    attrs: { min, max },
    parse: (val) => rangeToSpeed(+val),
    format: (val) => `${speedToRange(val)}`
  });

  cfg.observe("speed", (val) => {
    const label = range.children.item(0)
    
    if (label) {
      label.textContent = `${SPEED_TEXT} ${val.toFixed(getPrecision(val))}`
      cfg.interval = cfg.defaultInterval / val;
    }
  });

  return range;
};

export const createNumberInput = (
  title: string,
  field: NumberFields,
  props: NumberInputProps = {}
) => {
  const { min = 1, max = 1000, float = false, onChange } = props;
  const parse = (value: string) => {
    const num = float ? parseFloat(value) : ~~parseFloat(value);

    return num < min ? min : num > max ? max : num;
  };

  return createInput(title, field, { type: "number", parse, onChange });
};

export const createCheckbox = (
  title: string,
  field: "drawGrid",
  onChange?: () => void
) => {
  let checked = cfg[field];

  return createInput(title, field, {
    type: "checkbox",
    hor: true,
    onChange,
    attrs: {
      checked: checked ? "" : null,
    },
    parse: () => (checked = !checked),
  });
};
