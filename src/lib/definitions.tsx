import { CANVAS_COLUMNS, CANVAS_ROWS } from "../Definitions/Maps";
import { BasicEnemy } from "../GameObjects/Enemies/BasicEnemy";
import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";

export const DOMAIN = "ckal.dk";
export const BACKEND_URL = `https://api.${DOMAIN}/tower-defense/`;

export const LF_CREDENTIALS = "tower-defense_creds";
export const AWS_CLIENT_ID = "6nki0f24aj9hrvluekbmkea631";

export const TILE_SIZE = 30;
export const CANVAS_WIDTH = CANVAS_COLUMNS * TILE_SIZE;
export const CANVAS_HEIGHT = CANVAS_ROWS * TILE_SIZE;
export const SELL_PERCENTAGE = 0.5;
export const TICK_DURATION = 1000 / 60;
export const TICK_DURATION_S = TICK_DURATION / 1000;

export type MapSide = "up" | "right" | "down" | "left";

export type Teleporters = { [side in string]: { startPosition?: number; size: number } };

export interface MapInfo {
  position: Point;
  layout: string[][];
  teleporters: Teleporters;
}

export interface Point {
  x: number;
  y: number;
}

export enum APIResources {
  Leaderboard = "leaderboard",
  Score = "score",
}

export type EnemyConstructor = typeof BasicEnemy;

export type ActualProjectile = NormalProjectile;

export type TargetingMode = "First" | "Last" | "Closest" | "Random" | "Farthest" | "Weakest" | "Toughest";
export const TargetingModes: TargetingMode[] = [
  "First",
  "Last",
  "Closest",
  "Farthest",
  "Weakest",
  "Toughest",
  "Random",
];

export const experienceThresholdsNormal = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
export const experienceThresholdsPlayer = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];

export const COLOR_MONEY = "#edd500";
export const COLOR_EXP = "#90caf9";
export const COLOR_SKILLPOINT = "#57b4ff";
export const COLOR_DMG = "red";
export const COLOR_PLAYER = "#ed8300";
export const COLOR_HP_BAR_RED = "red";
export const COLOR_HP_BAR_GREEN = "#36e400";
export const COLOR_HP_GREEN = "#3cff00";
export const COLOR_MENU_BACKGROUND = "#ded4b2";
export const COLOR_STAT_BONUS_BLUE = "#0091df";
// export const COLOR_SELECTED = "#70baf6";
export const COLOR_SELECTED = "#4f97d1";
export const COLOR_GUN_SELECTED = "#4f97d1";

export const ANIM_COLLECT_TIME = 0.4;
export const ANIM_TIME = 1.0;
export const ANIM_MIN_REFRESH_TIME = 0.5;
