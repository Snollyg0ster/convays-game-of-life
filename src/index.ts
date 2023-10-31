import "./style.css";

import { root, buttonCont } from "./layout";
import { canvas, ctx } from "./game";
import { drawCells } from "./render";
import { cfg } from "./config";

root && root.append(canvas, buttonCont);
drawCells(ctx, cfg.field);
