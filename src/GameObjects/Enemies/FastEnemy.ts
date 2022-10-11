import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";

export class FastEnemy extends Enemy {
  constructor(path: Point[], hp: number, velocity: number, damage: number, reward: number) {
    super(path, hp, 9, "magenta", velocity, damage, reward);
  }
}
