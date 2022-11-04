import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { calculateDirection } from "../lib/canvasFunctions";
import { Point } from "../lib/definitions";
import { changeDirection } from "../lib/functions";
import { PistolSkills } from "../lib/skillDefinitions";
import { player, projectiles } from "../Shooter";
import { Gun } from "./Gun";

export class Pistol extends Gun {
  constructor() {
    super({
      name: "Pistol",
      damage: 7,
      magazineSize: 100,
      reloadTime: 1.2,
      fireRate: 2400,
      velocity: 3,
      projectileSize: 5,
      projectileColor: "black",
      ammo: 300,
      skills: PistolSkills,
    });
  }

  private calculateNextProjectilesDamage(): number {
    return Math.round(Math.random() * 3) + this.damage;
  }

  shoot(target: Point) {
    const direction = calculateDirection(player.getPosition(), target);
    const newAngle = Math.random() * 2 * this.currentRecoil - this.currentRecoil;
    const newDirection = changeDirection(direction, newAngle);

    projectiles.push(
      new NormalProjectile({
        position: player.getPosition(),
        direction: newDirection,
        velocity: this.velocity,
        damage: this.calculateNextProjectilesDamage(),
        size: this.projectileSize,
        color: this.projectileColor,
        shotByPlayer: true,
      })
    );
  }
}
