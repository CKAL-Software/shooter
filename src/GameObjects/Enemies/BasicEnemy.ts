import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";

export class BasicEnemy extends Enemy {
  constructor(path: Point[], hp: number, velocity: number, damage: number, reward: number) {
    super(path, hp, 12, "#aaaaaa", velocity, damage, reward);
  }
}
