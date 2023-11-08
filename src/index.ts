import "./style.css";

import { root, buttonCont } from "./layout";
import { drawGame, canvasCont, drawGrid } from "./game";
import {reflexy} from './reflexy'
import { addListeners } from "./listeners";

root && root.append(canvasCont, buttonCont);
reflexy();
drawGame();
drawGrid();
addListeners();