import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";

export interface ActualEnemyConfig {
  position: Point;
  hp: number;
  velocity: number;
  damage: number;
  reward: number;
}

export class BasicEnemy extends Enemy {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(config: ActualEnemyConfig) {
    super({ ...config, color: "#aaaaaa", size: 12 });
  }
}
