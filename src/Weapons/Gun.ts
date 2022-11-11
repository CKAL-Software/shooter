import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { RisingText } from "../GameObjects/RisingText";
import { calculateDirection } from "../lib/canvasFunctions";
import { COLOR_EXP, experienceThresholdsNormal, Point, TICK_DURATION_S } from "../lib/definitions";
import { changeDirection } from "../lib/functions";
import { SkillSheet } from "../lib/models";
import { createSkillSheet, Skill, SkillType, WeaponStat } from "../lib/skillDefinitions";
import { numberAnimations, player, projectiles } from "../Shooter";

export interface GunConfig {
  name: string;
  damage: number;
  magazineSize: number;
  reloadTime: number;
  fireRate: number;
  velocity: number;
  recoil: number;
  range: number;
  critChance: number;
  numBullets: number;
  projectileSize: number;
  projectileColor: string;
  ammo: number;
  price: number;
  skills: Skill[];
}

export abstract class Gun {
  protected level = 1;
  protected experience = 0;
  protected magazineAmmo = 0;
  protected ammo: number;
  protected baseDamage: number;
  protected damage: number;
  protected baseReloadTime: number;
  protected reloadTime: number;
  protected reloadTimeRemaining = 0;
  protected baseMagazineSize: number;
  protected magazineSize: number;
  protected baseFireRate: number;
  protected fireRate: number;
  protected fireTimeRemaining = 0;
  protected baseVelocity: number;
  protected velocity: number;
  protected baseRecoil: number;
  protected recoil: number;
  protected baseCritChance: number;
  protected critChance: number;
  protected baseRange: number;
  protected range: number;
  protected baseNumBullets: number;
  protected numBullets: number;
  protected projectileSize: number;
  protected projectileColor: string;
  protected shouldReload = false;
  protected name: string;
  protected skillSheet: SkillSheet = {};
  protected unusedSkillPoints = 3;
  protected price: number;

  constructor(config: GunConfig) {
    this.name = config.name;
    this.ammo = config.ammo;
    this.damage = config.damage;
    this.baseDamage = config.damage;
    this.reloadTime = config.reloadTime;
    this.baseReloadTime = config.reloadTime;
    this.magazineSize = config.magazineSize;
    this.baseMagazineSize = config.magazineSize;
    this.fireRate = config.fireRate;
    this.baseFireRate = config.fireRate;
    this.recoil = config.recoil;
    this.baseRecoil = config.recoil;
    this.range = config.range;
    this.baseRange = config.range;
    this.critChance = config.critChance;
    this.baseCritChance = config.critChance;
    this.numBullets = config.numBullets;
    this.baseNumBullets = config.numBullets;
    this.velocity = config.velocity;
    this.baseVelocity = config.velocity;
    this.projectileSize = config.projectileSize;
    this.projectileColor = config.projectileColor;
    this.price = config.price;

    this.skillSheet = createSkillSheet(config.skills);

    this.reload();
  }

  protected getNewDirectionAfterRecoil(target: Point) {
    const direction = calculateDirection(player.getPosition(), target);
    const newAngle = Math.random() * 2 * this.recoil - this.recoil;
    const newDirection = changeDirection(direction, newAngle);
    return newDirection;
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

    this.shoot(target);

    // this.currentRecoil += 15;
  }

  initiateReload() {
    if (this.reloadTimeRemaining === 0 && this.ammo > 0 && this.magazineAmmo !== this.magazineSize) {
      this.reloadTimeRemaining = this.reloadTime;
      this.magazineAmmo = 0;
      this.shouldReload = true;
    }
  }

  getRecoil(base?: boolean) {
    return base ? this.baseRecoil : this.recoil;
  }

  getRange(base?: boolean) {
    return base ? this.baseRange : this.range;
  }

  reload() {
    this.magazineAmmo = Math.min(this.magazineSize, this.ammo);
    this.shouldReload = false;
  }

  tick() {
    this.reloadTimeRemaining = Math.max(0, this.reloadTimeRemaining - TICK_DURATION_S);
    this.fireTimeRemaining = Math.max(0, this.fireTimeRemaining - TICK_DURATION_S);
    // this.currentRecoil = Math.max(10, this.currentRecoil - recoilRecoveryPerSecond * TICK_DURATION_S);

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
      this.unusedSkillPoints++;
      this.onLevelUp(this.level - 1);
      numberAnimations.push(new RisingText(player.getPosition(), "Level up!", COLOR_EXP));
    }
  }

  addAmmo(ammo: number) {
    this.ammo += ammo;
  }

  getExperience() {
    return this.experience;
  }

  getReloadProgress() {
    if (!this.shouldReload) {
      return 0;
    }
    return 1 - this.reloadTimeRemaining / this.reloadTime;
  }

  getReloadTime(base?: boolean) {
    return base ? this.baseReloadTime : this.reloadTime;
  }

  getLevel() {
    return this.level;
  }

  getAmmo() {
    return this.ammo;
  }

  getName() {
    return this.name;
  }

  getMagazineSize(base?: boolean) {
    return base ? this.baseMagazineSize : this.magazineSize;
  }

  getNumBullets(base?: boolean) {
    return base ? this.baseNumBullets : this.numBullets;
  }

  getCritChance(base?: boolean) {
    return base ? this.baseCritChance : this.critChance;
  }

  getCurrentEffect(stat: SkillType) {
    const skill = this.skillSheet[stat];

    if (!skill) {
      return 0;
    }

    return skill.getEffect(skill.points, this);
  }

  upgrade(stat: SkillType) {
    if (this.unusedSkillPoints < 1) {
      throw new Error("Upgrade method was called without any unused skillpoints");
    }

    this.unusedSkillPoints--;

    const skill = this.skillSheet[stat];
    if (!skill) {
      throw new Error("An upgrade was requested for skill that didn't exist in the gun");
    }

    skill.points++;
    const effect = skill.getEffect(skill.points, this);

    if (stat === "magSize") this.magazineSize = Math.round(this.baseMagazineSize + effect);
    if (stat === "damage") this.damage = Math.round(this.baseDamage + effect);
    if (stat === "reloadSpeed") this.reloadTime = this.baseReloadTime + effect;
  }

  getMagazineAmmo() {
    return this.magazineAmmo;
  }

  getPrice() {
    return this.price;
  }

  getDamage(base?: boolean) {
    return base ? this.baseDamage : this.damage;
  }

  getFireRate(base?: boolean) {
    return base ? this.baseFireRate : this.fireRate;
  }

  getVelocity(base?: boolean) {
    return base ? this.baseVelocity : this.velocity;
  }

  getSkillSheet() {
    return this.skillSheet;
  }

  getSkillPointsUsed(stat: SkillType) {
    return this.skillSheet[stat]?.points || 0;
  }

  getTotalSkillPointsUsed() {
    return Object.values(this.skillSheet).reduce((total, curr) => total + curr.points, 0);
  }

  getUnusedSkillPoints() {
    return this.unusedSkillPoints;
  }

  isReloading() {
    return this.reloadTimeRemaining > 0;
  }

  isLoadingBulletIntoChamber() {
    return this.fireTimeRemaining > 0;
  }

  protected getDamageForNextBullet() {
    if (Math.random() < this.critChance) {
      return this.damage * 3;
    }

    return this.damage;
  }

  shoot(target: Point) {
    const damage = this.getDamageForNextBullet();

    projectiles.push(
      new NormalProjectile({
        position: player.getPosition(),
        direction: this.getNewDirectionAfterRecoil(target),
        velocity: this.velocity * TICK_DURATION_S,
        damage: damage,
        range: this.range,
        size: this.projectileSize,
        color: this.projectileColor,
        shotByPlayer: true,
        ownerGun: this,
        isCriticalHit: damage > this.damage,
      })
    );
  }

  onLevelUp(levelIndex: number) {
    const upgrade = this.getLevelBonusStats(levelIndex);

    this.baseDamage += upgrade.damage;
    this.baseMagazineSize += upgrade.magSize;
    this.baseReloadTime -= upgrade.reloadTime;
    this.baseRecoil -= upgrade.recoil;
    this.baseVelocity += upgrade.velocity;
    this.baseFireRate += upgrade.fireRate;
    this.baseRange += upgrade.range;
  }

  abstract getLevelBonusStats(levelIndex: number): { [stat in WeaponStat]: number };
}
