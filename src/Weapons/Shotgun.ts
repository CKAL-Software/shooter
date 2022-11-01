import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { calculateDirection } from "../lib/canvasFunctions";
import { Point } from "../lib/definitions";
import { changeDirection } from "../lib/functions";
import { player, projectiles } from "../Shooter";
import { Gun } from "./Gun";

export class Shotgun extends Gun {
  constructor() {
    super({
      name: "Shotgun",
      magazineSize: 2,
      reloadTime: 3,
      fireRate: 60,
      velocity: 2.5,
      projectileSize: 4,
      projectileColor: "black",
      ammo: 20,
    });
  }

  shoot(target: Point) {
    const direction = calculateDirection(player.getPosition(), target);

    for (let i = 0; i < 7; i++) {
      const newAngle = Math.random() * 70 - 35;
      const newDirection = changeDirection(direction, newAngle);

      const position = player.getPosition();
      const delta = changeDirection({ x: player.getSize(), y: 0 }, Math.random() * 360);

      projectiles.push(
        new NormalProjectile({
          position: { x: position.x + delta.x, y: position.y + delta.y },
          direction: newDirection,
          velocity: this.velocity,
          damage: 5,
          size: this.projectileSize,
          color: this.projectileColor,
          shotByPlayer: true,
        })
      );
    }
  }
}
