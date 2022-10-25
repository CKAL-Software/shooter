import { pathToPoint } from "./lib/canvasFunctions";
import { TILE_SIZE } from "./lib/definitions";
import { map } from "./Shooter";

pathToPoint(map, { x: 5 * TILE_SIZE, y: 1 * TILE_SIZE }, { x: 11 * TILE_SIZE, y: 8 * TILE_SIZE });
