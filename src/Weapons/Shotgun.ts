import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { calculateDirection } from "../lib/canvasFunctions";
import { Point, TILE_SIZE } from "../lib/definitions";
import { changeDirection } from "../lib/functions";
import { ShotgunSkills } from "../lib/skillDefinitions";
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
      numBullets: 7,
      projectileSize: 4,
      projectileColor: "black",
      ammo: 2000,
      skills: ShotgunSkills,
    });
  }

  shoot(target: Point) {
    const direction = calculateDirection(player.getPosition(), target);

    for (let i = 0; i < this.numBullets; i++) {
      const newAngle = Math.random() * this.recoil - this.recoil / 2;
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
          ownerGun: this,
        })
      );
    }
  }

  onLevelUp(levelIndex: number): void {
    this.baseDamage += [1, 0, 1, 0, 1, 0, 1, 0, 1][levelIndex];
    this.baseMagazineSize += [0, 0, 1, 0, 0, 1, 0, 0, 1][levelIndex];
    this.baseReloadTime -= 0.12;
    this.baseRecoil -= 3;
    this.baseVelocity += 0.15;
    this.baseFireRate += 3;
    this.baseRange += 5;
    this.baseNumBullets += [0, 1, 0, 1, 0, 1, 0, 1, 1][levelIndex];
  }
}
