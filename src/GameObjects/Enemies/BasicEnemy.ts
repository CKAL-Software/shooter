import { Point, TILE_SIZE } from "../../lib/definitions";
import { EnemyStat, Stat } from "../../lib/skillDefinitions";
import { Enemy } from "../Enemies/Enemy";

export interface ActualEnemyConfig {
  level: number;
  position: Point;
}

export class BasicEnemy extends Enemy {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(config: ActualEnemyConfig) {
    super({ ...config, velocity: 0, color: "#aaaaaa", size: 12 });
  }

  getStatsForLevel(level: number): { [stat in EnemyStat]: number } {
    const levelIndex = level - 1;

    return {
      [Stat.MaxHealth]: [5, 10, 20, 40, 80, 160][levelIndex],
      [Stat.MoveSpeed]: [0.5, 0.7, 0.9, 1.1, 1.3, 1.5][levelIndex],
      [Stat.Reward]: [5, 10, 20, 40, 80, 160][levelIndex],
      [Stat.Damage]: [1, 2, 3, 4, 5, 6][levelIndex],
      [Stat.FireRate]: [20, 30, 40, 50, 60, 70][levelIndex],
      [Stat.Velocity]: [1, 1.5, 2, 2.5, 3, 3.5][levelIndex],
      [Stat.Range]: [3, 4, 5, 6, 7, 8][levelIndex] * TILE_SIZE,
      [Stat.Recoil]: [40, 30, 20, 10, 5, 0][levelIndex],
      [Stat.Projectiles]: 1,
    };
  }
}
