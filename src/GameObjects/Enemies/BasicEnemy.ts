import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";

export interface BasicEnemyConfiguration {
  startPosition: Point;
  hp: number;
  velocity: number;
  damage: number;
  reward: number;
}

export class BasicEnemy extends Enemy {
  constructor(configuration: BasicEnemyConfiguration) {
    super({
      startPosition: configuration.startPosition,
      hp: configuration.hp,
      size: 12,
      color: "#aaaaaa",
      velocity: configuration.velocity,
      damage: configuration.damage,
      reward: configuration.reward,
    });
  }
}
