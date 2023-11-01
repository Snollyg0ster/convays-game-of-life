"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
      if (decorator = decorators[i])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // src/utils/decorators.ts
  var Observer = class {
    observers = {};
    observe = (key, cb) => {
      const id = Symbol("id");
      if (this.observers[key]) {
        this.observers[key].set(id, cb);
      } else {
        this.observers[key] = /* @__PURE__ */ new Map([[id, cb]]);
      }
      return { key, id };
    };
    unsubscribe = ({ key, id }) => {
      this.observers[key]?.delete(id);
    };
    emit = (key, val) => {
      this.observers[key]?.forEach((cb) => cb(val, key));
    };
  };
  function observe(constructor) {
    return class Observed extends constructor {
      constructor(...args) {
        super(...args);
        const object = new constructor();
        Object.assign(object, new Observer());
        return new Proxy(object, {
          set(target, key, value) {
            target[key] = value;
            target.emit(key, value);
            return true;
          }
        });
      }
    };
  }
  function bind(target, propertyKey, descriptor) {
    if (!descriptor || typeof descriptor.value !== "function") {
      throw new TypeError(
        `Only methods can be decorated with @bind. <${propertyKey}> is not a method!`
      );
    }
    return {
      configurable: true,
      get() {
        const bound = descriptor.value.bind(this);
        Object.defineProperty(this, propertyKey, {
          value: bound,
          configurable: true,
          writable: true
        });
        return bound;
      }
    };
  }

  // src/config.ts
  var Config = class {
    cellSize = 10;
    horCount = 120;
    verCount = 50;
    speed = 1;
    interval = 100;
    // 0.1s
    defaultInterval = 100;
    // 0.1s
    backgroundColor = "black";
    cellColor = "#ffffff";
    cursorColor = "#aa0000";
    gridColor = "#808080";
    drawGrid = true;
    gridWidth = 1;
    dencityOfRandomFill = 0.5;
    prevField = [];
    field;
    constructor(field) {
      this.field = field || this.initField;
    }
    get initField() {
      return Array.from(
        { length: this.verCount },
        () => new Array(this.horCount)
      );
    }
    get gameWidth() {
      const gridWidth = this.drawGrid ? this.gridWidth : 0;
      return (this.cellSize + gridWidth) * this.horCount;
    }
    get gameHeight() {
      const gridWidth = this.drawGrid ? this.gridWidth : 0;
      return (this.cellSize + gridWidth) * this.verCount;
    }
    resetField() {
      this.field = this.initField;
      this.prevField = this.initField;
      console.log("resetField");
    }
  };
  __decorateClass([
    bind
  ], Config.prototype, "resetField", 1);
  Config = __decorateClass([
    observe
  ], Config);
  var cfg = new Config();

  // src/consts/text.ts
  var START_TEXT = "\u0421\u0442\u0430\u0440\u0442 \u{1F680}";
  var STOP_TEXT = "\u0421\u0442\u043E\u043F \u26D4\uFE0F";
  var CLEAR_TEXT = "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u232B";
  var NEXT_FRAME_TEXT = "\u0414\u0430\u043B\u0435\u0435 \u23ED\uFE0F";
  var SPEED_TEXT = "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C";
  var EXAMPLE_TEXT = "\u041F\u0440\u0438\u043C\u0435\u0440 \u{1FA84}";
  var BACKGROUND_COLOR_TEXT = "\u0426\u0432\u0435\u0442 \u0444\u043E\u043D\u0430";
  var CELL_COLOR_TEXT = "\u0426\u0432\u0435\u0442 \u043A\u043B\u0435\u0442\u043E\u043A";
  var GRID_COLOR_TEXT = "\u0426\u0432\u0435\u0442 \u0441\u0435\u0442\u043A\u0438";
  var RANDOM_TEXT = "\u0421\u043B\u0443\u0447\u0430\u0439\u043D\u043E \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u{1F3B2}";
  var DENCITY_TEXT = "\u041F\u043B\u043E\u0442\u043D\u043E\u0441\u0442\u044C";
  var GRID_TEXT = "\u0420\u0438\u0441\u043E\u0432\u0430\u0442\u044C \u0441\u0435\u0442\u043A\u0443";

  // src/utils/common.ts
  function assertEventTarget(event, element) {
    if (event.target && event.target instanceof element) {
      return;
    }
    throw Error(`Target is not instance of ${element}`);
  }
  var voidExecutor = (...fns) => () => fns.forEach((fn) => fn());
  var getCellCoord = (e) => {
    const gridWidth = cfg.drawGrid ? cfg.gridWidth : 0;
    const x = ~~(e.offsetX / (cfg.cellSize + gridWidth));
    const y = ~~(e.offsetY / (cfg.cellSize + gridWidth));
    return { x, y };
  };
  var toggleCell = ({ x, y }, alive) => {
    if (y === cfg.verCount) {
      return;
    }
    cfg.field[y][x] = alive === void 0 ? !cfg.field[y][x] : alive;
  };

  // src/layout/elements.ts
  var createCanvas = () => {
    const canvasCont2 = document.createElement("div");
    const gameCanvas = document.createElement("canvas");
    const gridCanvas = document.createElement("canvas");
    const uiCanvas2 = document.createElement("canvas");
    const gameCtx = gameCanvas.getContext("2d");
    const gridCtx = gridCanvas.getContext("2d");
    const uiCtx = uiCanvas2.getContext("2d");
    const canvases = [gameCanvas, gridCanvas, uiCanvas2];
    const canvas2 = {
      game: { el: gameCanvas, ctx: gameCtx },
      grid: { el: gridCanvas, ctx: gridCtx },
      ui: { el: uiCanvas2, ctx: uiCtx }
    };
    canvasCont2.append(...canvases);
    canvasCont2.classList.add("canvas-cont");
    gameCanvas.id = "game-canvas";
    gridCanvas.id = "grid-canvas";
    uiCanvas2.id = "ui-canvas";
    [gridCanvas, uiCanvas2].forEach((canvas3) => canvas3.classList.add("canvas"));
    const updateCanvas2 = (canvas3, i) => {
      canvas3.height = cfg.gameHeight;
      canvas3.width = cfg.gameWidth;
      canvas3.style.width = `${cfg.gameWidth}px`;
      canvas3.style.height = `${cfg.gameHeight}px`;
    };
    const changeCanvasColor2 = () => {
      gameCanvas.style.background = cfg.backgroundColor;
    };
    const updateCanvasStyle2 = () => canvases.forEach(updateCanvas2);
    updateCanvasStyle2();
    changeCanvasColor2();
    return { canvas: canvas2, canvasCont: canvasCont2, updateCanvasStyle: updateCanvasStyle2, changeCanvasColor: changeCanvasColor2 };
  };
  var createGameButton = (cb, isRuning = false) => {
    const gameButton2 = document.createElement("button");
    gameButton2.textContent = isRuning ? STOP_TEXT : START_TEXT;
    let stopGame;
    gameButton2.onclick = () => {
      isRuning = !isRuning;
      gameButton2.textContent = isRuning ? STOP_TEXT : START_TEXT;
      if (isRuning) {
        stopGame = cb();
      } else {
        stopGame?.();
      }
    };
    return gameButton2;
  };
  var createCbButton = (title, cb) => {
    const button = document.createElement("button");
    button.textContent = title;
    button.onclick = cb;
    return button;
  };
  var createInput = (title, field, props) => {
    const {
      type,
      hor = false,
      attrs = {},
      labelClass,
      inputClass,
      contClass,
      onChange,
      format,
      parse
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
      const val = parse ? parse(e.target.value) : e.target.value;
      cfg[field] = val;
      onChange?.(e.target.value, onChangeProps);
    };
    return cont;
  };
  var createGameSpeedSlider = (min = -89, max = 200) => {
    const rangeToSpeed = (val) => val >= 10 ? val / 10 : 1 + (val - 10) * 0.01;
    const speedToRange = (val) => val >= 1 ? val * 10 : (val - 0.9) * 100;
    const getPrecision = (speed) => speed < 0.2 ? 2 : speed < 1 ? 1 : 0;
    const label = `${SPEED_TEXT} ${cfg.speed.toFixed(getPrecision(cfg.speed))}`;
    const range = createInput(label, "speed", {
      type: "range",
      attrs: { min, max },
      parse: (val) => rangeToSpeed(+val),
      format: (val) => `${speedToRange(val)}`
    });
    cfg.observe("speed", (val) => {
      const label2 = range.children.item(0);
      if (label2) {
        label2.textContent = `${SPEED_TEXT} ${val.toFixed(getPrecision(val))}`;
        cfg.interval = cfg.defaultInterval / val;
      }
    });
    return range;
  };
  var createNumberInput = (title, field, props = {}) => {
    const { min = 1, max = 1e3, float = false, onChange } = props;
    const parse = (value) => {
      const num = float ? parseFloat(value) : ~~parseFloat(value);
      return num < min ? min : num > max ? max : num;
    };
    return createInput(title, field, { type: "number", parse, onChange });
  };
  var createCheckbox = (title, field, onChange) => {
    let checked = cfg[field];
    return createInput(title, field, {
      type: "checkbox",
      hor: true,
      onChange,
      attrs: {
        checked: checked ? "" : null
      },
      parse: () => checked = !checked
    });
  };

  // src/consts/defaults.ts
  var preloadedField = `[[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,true,false,false,false,false,true,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,true,false,false,false,false,true,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,true,false,false,false,false,true,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,true,false,false,false,false,true,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,true,false,false,false,false,true,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,true,false,false,false,false,true,false,true,false,false,false,false,true,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,true,true,false,false,false,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,true,true,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]]`;

  // src/render.ts
  var clearCtx = (ctx) => ctx && ctx.clearRect(0, 0, cfg.gameWidth, cfg.gameHeight);
  function renderGrid(ctx) {
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
  function renderCells(ctx, field) {
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

  // src/game.ts
  var { canvas, canvasCont, updateCanvasStyle, changeCanvasColor } = createCanvas();
  var drawGame = () => renderCells(canvas.game.ctx, cfg.field);
  var drawGrid = () => cfg.cellSize > 1 && cfg.drawGrid && renderGrid(canvas.grid.ctx);
  var uiCanvas = canvas.ui.el;
  var mouseMoveCount = 0;
  var onMouseMove = (e) => {
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
    ;
    mouseMoveCount = 0;
  });
  var getIndex = (len, pos) => pos > len ? 0 : pos < 0 ? len : pos;
  var getNeighbours = (field, x, y) => {
    let neighbours = field[y][x] ? -1 : 0;
    const bottom = y + 2, right = x + 2, fieldLen = field.length - 1;
    for (let i = y - 1; i < bottom; i++) {
      const row = field[getIndex(fieldLen, i)];
      const rowLen = row.length - 1;
      for (let j = x - 1; j < right; j++) {
        const neighbour = row[getIndex(rowLen, j)];
        neighbours += neighbour ? 1 : 0;
      }
    }
    return neighbours;
  };
  var game = (field) => {
    const newField = cfg.initField;
    cfg.prevField = field;
    for (let y = 0; y < field.length; y++) {
      const row = newField[y];
      for (let x = 0; x < row.length; x++) {
        const neighbours = getNeighbours(cfg.prevField, x, y);
        if (!cfg.prevField[y][x]) {
          if (neighbours === 3) {
            row[x] = true;
          }
        } else {
          if (neighbours > 3 || neighbours < 2) {
            row[x] = false;
          } else {
            row[x] = true;
          }
        }
      }
    }
    return newField;
  };
  var nextFrame = () => {
    cfg.field = game(cfg.field);
    drawGame();
  };
  var startGame = () => {
    let lastRender = performance.now();
    let run = true;
    const loop = (delta) => {
      if (!run) {
        return;
      }
      const rerenderTime = lastRender + cfg.interval;
      if (delta >= rerenderTime) {
        nextFrame();
        lastRender = delta - (delta - rerenderTime);
      }
      requestAnimationFrame(loop);
    };
    loop(performance.now());
    return () => {
      run = false;
    };
  };

  // src/layout/index.ts
  var buttonCont = document.createElement("div");
  var root = document.getElementById("root");
  var gameButton = createGameButton(startGame);
  var nextFrameButton = createCbButton(NEXT_FRAME_TEXT, nextFrame);
  var clearButton = createCbButton(CLEAR_TEXT, voidExecutor(cfg.resetField, drawGame));
  var gameSpeed = createGameSpeedSlider();
  var verSizeInput = createNumberInput("\u0420\u0430\u0437\u043C\u0435\u0440 \u043F\u043E \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u0438", "verCount", { onChange: cfg.resetField });
  var horSizeInput = createNumberInput("\u0420\u0430\u0437\u043C\u0435\u0440 \u043F\u043E \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u0438", "horCount", { onChange: cfg.resetField });
  var cellSizeInput = createNumberInput("\u0420\u0430\u0437\u043C\u0435\u0440 \u043A\u043B\u0435\u0442\u043A\u0438 (px)", "cellSize");
  var drawGridButton = createCheckbox(GRID_TEXT, "drawGrid");
  var logFunction = () => console.log(
    JSON.stringify(
      cfg.field.map((row) => row.map((cell) => !!cell))
    ).replaceAll("],", "],\n")
  );
  var logButton = createCbButton("log", logFunction);
  var drawExampleField = () => {
    cfg.resetField();
    cfg.field = JSON.parse(preloadedField);
    cfg.verCount = 50;
    cfg.horCount = 50;
    cfg.cellSize = 10;
    cfg.speed = 1;
  };
  var exampleButton = createCbButton(EXAMPLE_TEXT, drawExampleField);
  var backgroundColor = createInput(BACKGROUND_COLOR_TEXT, "backgroundColor", { type: "color" });
  var cellColor = createInput(CELL_COLOR_TEXT, "cellColor", { type: "color" });
  var gridColor = createInput(GRID_COLOR_TEXT, "gridColor", { type: "color" });
  var colorCont = document.createElement("div");
  colorCont.classList.add("row");
  colorCont.append(backgroundColor, cellColor, gridColor);
  var randomlyFillField = () => {
    const dencity = cfg.dencityOfRandomFill;
    const randomField = cfg.initField;
    cfg.field = randomField.map((row) => row.fill(false)).map((row) => row.map(() => Math.random() < dencity));
    drawGame();
  };
  var randomButton = createCbButton(RANDOM_TEXT, randomlyFillField);
  var randomDencity = createInput(
    `${DENCITY_TEXT} ${~~(+cfg.dencityOfRandomFill * 100)}%`,
    "dencityOfRandomFill",
    {
      type: "range",
      attrs: {
        min: 0.01,
        max: 1,
        step: 0.01
      },
      parse: (val) => +val,
      onChange: (val, { label }) => label.textContent = `${DENCITY_TEXT} ${~~(+val * 100)}%`
    }
  );
  var randomFillCont = document.createElement("div");
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

  // src/reflexy.ts
  var updateCanvas = voidExecutor(updateCanvasStyle, drawGame, drawGrid);
  var reflexy = () => {
    cfg.observe("verCount", updateCanvas);
    cfg.observe("horCount", updateCanvas);
    cfg.observe("backgroundColor", changeCanvasColor);
    cfg.observe("cellSize", updateCanvas);
    cfg.observe("drawGrid", updateCanvas);
    cfg.observe("cellColor", drawGame);
    cfg.observe("gridColor", drawGrid);
  };

  // src/index.ts
  root && root.append(canvasCont, buttonCont);
  reflexy();
  drawGame();
  drawGrid();
})();
