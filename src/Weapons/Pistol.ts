import { Gun } from "./Gun";

export class Pistol extends Gun {
  constructor(
    magazineSize: number,
    reloadTime: number,
    velocity: number,
    projectileSize: number,
    projectileColor: string,
    ammo: number
  ) {
    super(magazineSize, reloadTime, 240, velocity, projectileSize, projectileColor, ammo);
  }

  calculateNextProjectilesDamage(): number {
    return Math.round(Math.random() * 2) + 2;
  }
}
