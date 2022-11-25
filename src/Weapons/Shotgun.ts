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
      stats: {
        magSize: 2,
        reloadSpeed: 3,
        fireRate: 60,
        velocity: 100,
        damage: 5,
        critChance: 0,
        range: TILE_SIZE * 3,
        recoil: 100,
        projectiles: 7,
        burn: 0,
        penetration: 0,
        dropChance: 0,
        ammoCost: 10,
      },
      projectileSize: 4,
      projectileColor: "black",
      ammo: 2000,
      price: 5,
      skills: ShotgunSkills,
    });
  }

  shoot(target: Point) {
    const direction = calculateDirection(player.getPosition(), target);

    for (let i = 0; i < this.stats.projectiles; i++) {
      const newAngle = Math.random() * this.stats.recoil - this.stats.recoil / 2;
      const newDirection = changeDirection(direction, newAngle);

      // const position = player.getPosition();
      // const delta = changeDirection({ x: player.getSize(), y: 0 }, Math.random() * 360);

      const damage = this.getDamageForNextBullet();

      projectiles.push(
        new NormalProjectile({
          // position: { x: position.x + delta.x, y: position.y + delta.y },
          position: player.getPosition(),
          direction: newDirection,
          velocity: this.stats.velocity,
          damage: damage,
          range: this.stats.range,
          size: this.projectileSize,
          color: this.projectileColor,
          shotByPlayer: true,
          ownerGun: this,
          isCriticalHit: damage > this.stats.damage,
        })
      );
    }
  }

  getLevelBonusStats(levelIndex: number) {
    return {
      damage: 10,
      magSize: [0, 0, 1, 0, 0, 1, 0, 0, 2][levelIndex],
      reloadSpeed: -0.12,
      recoil: -3,
      velocity: 5,
      fireRate: 3,
      range: 5,
      projectiles: [0, 1, 0, 1, 0, 1, 0, 1, 1][levelIndex],
      critChance: 0,
      penetration: 0,
      ammoCost: 0,
      dropChance: 0,
      burn: 0,
    };
  }
}
