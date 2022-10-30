import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { calculateDirection } from "../lib/canvasFunctions";
import { Point } from "../lib/definitions";
import { changeDirection } from "../lib/functions";
import { player, projectiles } from "../Shooter";
import { Gun } from "./Gun";

export class Pistol extends Gun {
  constructor() {
    super({
      name: "Pistol",
      magazineSize: 3,
      reloadTime: 1.2,
      fireRate: 2400,
      velocity: 3,
      projectileSize: 5,
      projectileColor: "black",
      ammo: 300,
    });
  }

  private calculateNextProjectilesDamage(): number {
    return Math.round(Math.random() * 3) + 7;
  }

  shoot(target: Point) {
    const direction = calculateDirection(player.getPosition(), target);
    const newAngle = Math.random() * 30 - 15;
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
