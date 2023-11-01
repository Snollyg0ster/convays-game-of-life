import "./style.css";

import { root, buttonCont } from "./layout";
import { drawGame, canvasCont, drawGrid } from "./game";
import {reflexy} from './reflexy'

root && root.append(canvasCont, buttonCont);
reflexy();
drawGame();
drawGrid();