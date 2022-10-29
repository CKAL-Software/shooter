import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { calculateDirection } from "../lib/canvasFunctions";
import { experienceThresholdsNormal, Point, TICK_DURATION_S } from "../lib/definitions";
import { changeDirection } from "../lib/functions";
import { player, projectiles } from "../Shooter";

export interface GunConfigutation {
  magazineSize: number;
  reloadTime: number;
  fireRate: number;
  velocity: number;
  projectileSize: number;
  projectileColor: string;
  ammo: number;
}

export abstract class Gun {
  protected level = 1;
  protected experience = 0;
  protected magazineAmmo = 0;
  protected ammo: number;
  protected reloadTime: number;
  protected reloadTimeRemaining = 0;
  protected magazineSize: number;
  protected fireRate: number;
  protected fireTimeRemaining = 0;
  protected velocity: number;
  protected projectileSize: number;
  protected projectileColor: string;
  protected shouldReload = false;

  constructor(configuration: GunConfigutation) {
    this.ammo = configuration.ammo;
    this.reloadTime = configuration.reloadTime;
    this.magazineSize = configuration.magazineSize;
    this.fireRate = configuration.fireRate;
    this.velocity = configuration.velocity;
    this.projectileSize = configuration.projectileSize;
    this.projectileColor = configuration.projectileColor;
    this.reload();
  }

  fire(target: Point) {
    if (this.fireTimeRemaining > 0) {
      return;
    }

    if (this.magazineAmmo === 0) {
      return;
    }

    this.ammo--;
    this.magazineAmmo--;
    this.fireTimeRemaining = 60 / this.fireRate;

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

  initiateReload() {
    if (this.reloadTimeRemaining <= 0 && this.ammo > 0) {
      this.reloadTimeRemaining = this.reloadTime;
      this.shouldReload = true;
    }
  }

  reload() {
    this.magazineAmmo = Math.min(this.magazineSize, this.ammo);
    this.shouldReload = false;
  }

  tick() {
    this.reloadTimeRemaining -= TICK_DURATION_S;
    this.fireTimeRemaining -= TICK_DURATION_S;

    if (this.magazineAmmo === 0 && !this.shouldReload) {
      this.initiateReload();
    }

    if (this.shouldReload && this.reloadTimeRemaining <= 0) {
      this.reload();
    }
  }

  addExperience(experience: number) {
    this.experience += experience;

    while (this.experience >= experienceThresholdsNormal[this.level - 1]) {
      this.experience -= experienceThresholdsNormal[this.level - 1];
      this.level++;
    }
  }

  getExperience() {
    return this.experience;
  }

  getLevel() {
    return this.level;
  }

  getAmmo() {
    return this.ammo;
  }

  getMagazineSize() {
    return this.magazineSize;
  }

  getMagazineAmmo() {
    return this.magazineAmmo;
  }

  abstract calculateNextProjectilesDamage(): number;
}
