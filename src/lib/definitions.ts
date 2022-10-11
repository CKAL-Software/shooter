import { BasicEnemy } from "../GameObjects/Enemies/BasicEnemy";
import { ToughEnemy } from "../GameObjects/Enemies/ToughEnemy";
import { HeatSeekingProjectile } from "../GameObjects/Projectiles/HeatSeekingProjectile";
import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { SlowingProjectile } from "../GameObjects/Projectiles/SlowingProjectile";
import { BasicTower } from "../GameObjects/Towers/BasicTowers";
import { MachineGunTower } from "../GameObjects/Towers/MachineGunTower";
import { SniperTower } from "../GameObjects/Towers/ScoutTower";

export const DOMAIN = "ckal.dk";
export const BACKEND_URL = `https://api.${DOMAIN}/tower-defense/`;

export const LF_CREDENTIALS = "tower-defense_creds";
export const AWS_CLIENT_ID = "6nki0f24aj9hrvluekbmkea631";

export const CANVAS_ROWS = 15;
export const CANVAS_COLUMNS = 20;
export const TILE_SIZE = 50;
export const TOWER_SIZE = 40;
export const CANVAS_WIDTH = CANVAS_COLUMNS * TILE_SIZE;
export const CANVAS_HEIGHT = CANVAS_ROWS * TILE_SIZE;
export const SELL_PERCENTAGE = 0.5;
export const TICK_DURATION = 5;

export interface Point {
  x: number;
  y: number;
}

export enum APIResources {
  Leaderboard = "leaderboard",
  Score = "score",
}

export type ProjectileContructor = typeof NormalProjectile | typeof HeatSeekingProjectile | typeof SlowingProjectile;
export type TowerConstructor = typeof BasicTower | typeof SniperTower | typeof MachineGunTower;
export type EnemyConstructor = typeof BasicEnemy | typeof ToughEnemy;

export type ActualTower = BasicTower | SniperTower | MachineGunTower;
export type ActualProjectile = NormalProjectile | HeatSeekingProjectile | SlowingProjectile;

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
