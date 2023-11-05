import { Observed, bind, observe } from "./utils/decorators";
import { Cell } from "./types";

@observe
class Config {
  public cellSize = 10;
  public horCount = 120;
  public verCount = 50;
  public speed = 1;
  public interval = 100; // 0.1s
  public defaultInterval = 100; // 0.1s
  public backgroundColor = "black";
  public cellColor = "#ffffff";
  public cursorColor = "#aa0000";
  public gridColor = "#808080";
  public drawGrid = true;
  public gridWidth = 1;
  public dencityOfRandomFill = 0.5;
  public prevField: Cell[][] = [];
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
    this.prevField = this.initField;
    console.log('resetField')
  }
}

export const cfg = new Config() as Observed<Config>;
export default Config;