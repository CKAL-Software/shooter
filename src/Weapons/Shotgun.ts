import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { calculateDirection } from "../lib/canvasFunctions";
import { Point, TILE_SIZE } from "../lib/definitions";
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
      damage: 5,
      critChance: 0,
      range: TILE_SIZE * 3,
      recoil: 100,
      projectileSize: 4,
      projectileColor: "black",
      ammo: 20,
      skills: [],
    });
  }

  shoot(target: Point) {
    const direction = calculateDirection(player.getPosition(), target);

    const numBullets = 7;

    for (let i = 0; i < numBullets; i++) {
      const newAngle = (i * this.recoil) / (numBullets - 1) - this.recoil / 2;
      const newDirection = changeDirection(direction, newAngle);

      // const position = player.getPosition();
      // const delta = changeDirection({ x: player.getSize(), y: 0 }, Math.random() * 360);

      projectiles.push(
        new NormalProjectile({
          // position: { x: position.x + delta.x, y: position.y + delta.y },
          position: player.getPosition(),
          direction: newDirection,
          velocity: this.velocity,
          damage: this.damage,
          range: this.range,
          size: this.projectileSize,
          color: this.projectileColor,
          shotByPlayer: true,
        })
      );
    }
  }
}
