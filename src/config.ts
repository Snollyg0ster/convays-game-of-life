import { Observed, observe } from "./decorator";
import { Cell } from "./types";

@observe
class Config {
  cellSize = 10;
  horCount = 120;
  verCount = 50;
  speed = 1;
  interval = 100; // 0.1s
  defaultInterval = 100; // 0.1s
  backgroundColor = "black";
  cellColor = "#ffffff";
  cursorColor = "#aa0000";
  gridColor = "#808080";
  drawGrid = true;
  gridWidth = 1;
  dencityOfRandomFill = 0.5;
  prevField: Cell[][] = [];
  field: Cell[][];

  constructor(field?: Cell[][]) {
    this.field = field || this.initField;
  }

  get initField(): Cell[][] {
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
  }
}

export const cfg = new Config() as Observed<Config>;
export default Config;