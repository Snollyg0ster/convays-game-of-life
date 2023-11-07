import { Observed, bind, observe } from "./utils/decorators";
import { Cell, CellCoord, Selection } from "./types";
import { copy } from "./utils/common";

@observe
class Config {
  public cellSize = 10;
  public horCount = 120;
  public verCount = 50;
  public gridWidth = 1;

  public speed = 1; // defaultInterval / interval
  public interval = 100; // 0.1s
  public defaultInterval = 100; // 0.1s

  public backgroundColor = "black";
  public cellColor = "#ffffff";
  public cursorColor = "#f4a261";
  public gridColor = "#808080";
  public selectionColor = "#e76f51";

  public drawGrid = true;
  public dencityOfRandomFill = 0.5;

  public selection: Selection = null;

  public field: Cell[][];

  constructor(field?: Cell[][]) {
    this.field = field || this.initField;
  }

  public get initField(): Cell[][] {
    return Array.from(
      { length: this.verCount },
      () => new Array(this.horCount)
    );
  }

  public get gameWidth() {
    const gridWidth = this.drawGrid ? this.gridWidth : 0;
    return (this.cellSize + gridWidth) * this.horCount;
  }

  public get gameHeight() {
    const gridWidth = this.drawGrid ? this.gridWidth : 0;
    return (this.cellSize + gridWidth) * this.verCount;
  }

  @bind
  public resetField() {
    this.field = this.initField;
  }

  @bind
  public setSelection(coord?: CellCoord | null) {
    if(!coord) {
      this.selection = null;
      return;
    }

    if (this.selection) {
      const {center} = this.selection;
      const [x1, x2] = center.x <= coord.x ? [center.x, coord.x] : [coord.x, center.x];
      const [y1, y2] = center.y <= coord.y ? [center.y, coord.y] : [coord.y, center.y];

      this.selection = {start: {x: x1, y: y1}, end: {x: x2, y: y2}, center};
    } else {
      this.selection = {start: coord, end: coord, center: coord};
    }
  }
}

export const cfg = new Config() as Observed<Config>;
export default Config;