import { CANVAS_COLUMNS, CANVAS_ROWS } from "../Definitions/Maps";
import { BasicEnemy } from "../GameObjects/Enemies/BasicEnemy";
import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";

export const TILE_SIZE = 30;
export const CANVAS_WIDTH = CANVAS_COLUMNS * TILE_SIZE;
export const CANVAS_HEIGHT = CANVAS_ROWS * TILE_SIZE;
export const SELL_PERCENTAGE = 0.5;
export const TICK_DURATION = 1000 / 60;
export const TICK_DURATION_S = TICK_DURATION / 1000;

export type MapSide = "up" | "right" | "down" | "left";

export type Teleporters = { [side in MapSide]?: { size: number; startPosition: number } };

export interface MapInfo {
  position: Point;
  layout: string[][];
  teleporters: Teleporters;
  hasShop: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export enum APIResources {
  Leaderboard = "leaderboard",
  Score = "score",
}

export type GameLogType = "normal" | "level up";

export interface GameLog {
  id: number;
  text: string;
  type: GameLogType;
  timestamp: string;
}

export const STRAY_TO_LEVEL = {
  3: 1,
  6: 2,
  10: 3,
  15: 4,
  20: 5,
  30: 6,
  40: 7,
  50: 8,
  60: 9,
  70: 10,
};

export type EnemyConstructor = typeof BasicEnemy;

export type ActualProjectile = NormalProjectile;

export const experienceThresholdsNormal = [0, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
export const experienceThresholdsPlayer = [0, 0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];

export const ANIM_COLLECT_TIME = 0.4;
export const ANIM_TIME = 1.0;
export const ANIM_MIN_REFRESH_TIME = 0.5;
