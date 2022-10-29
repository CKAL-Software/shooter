import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";

export class BasicEnemy extends Enemy {
  constructor(position: Point) {
    super({
      position,
      hp: 50,
      size: 12,
      color: "#aaaaaa",
      velocity: 1.5,
      damage: 5,
      reward: 10,
    });
  }
}
