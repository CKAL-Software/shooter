import { Point, TILE_SIZE } from "../../lib/definitions";
import { EnemyStat, Stat } from "../../lib/skillDefinitions";
import { Enemy } from "../Enemies/Enemy";

export interface ActualEnemyConfig {
  level: number;
  position: Point;
}

export class BasicEnemy extends Enemy {
  name = "Basic";

  constructor(config: ActualEnemyConfig) {
    super({ ...config, velocity: 0, color: "#aaaaaa", size: 12 });
  }

  getStatsForLevel(level: number): { [stat in EnemyStat]: number } {
    const levelIndex = level - 1;

    return {
      [Stat.MaxHealth]: Math.round(5 + levelIndex * 5),
      [Stat.MoveSpeed]: 0.5 + 0.2 * levelIndex,
      [Stat.Reward]: Math.round(5 + levelIndex * 5),
      [Stat.Damage]: levelIndex,
      [Stat.FireRate]: 20 + 10 * levelIndex,
      [Stat.Velocity]: 1 + 0.5 * levelIndex,
      [Stat.Range]: (3 + levelIndex) * TILE_SIZE,
      [Stat.Recoil]: Math.max(0, 40 - 5 * levelIndex),
      [Stat.Projectiles]: 1,
    };
  }
}
