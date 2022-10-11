import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";

export class BasicEnemy extends Enemy {
  constructor(startPosition: Point, hp: number, velocity: number, damage: number, reward: number) {
    super(startPosition, hp, 12, "#aaaaaa", velocity, damage, reward);
  }
}
