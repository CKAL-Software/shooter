import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { RisingText } from "../GameObjects/RisingText";
import { calculateDirection } from "../lib/canvasFunctions";
import { COLOR_EXP, experienceThresholdsNormal, Point, TICK_DURATION_S } from "../lib/definitions";
import { changeDirection } from "../lib/functions";
import { SkillSheet } from "../lib/models";
import { createSkillSheet, Skill, WeaponStat, WeaponStats, Stat } from "../lib/skillDefinitions";
import { numberAnimations, player, projectiles } from "../Shooter";

export interface GunConfig {
  name: string;
  baseStats: WeaponStats;
  projectileSize: number;
  projectileColor: string;
  ammo: number;
  price: number;
  skills: Skill<WeaponStat>[];
}

export abstract class Gun {
  protected name: string;
  private level = 1;
  private experience = 0;
  private damageDealt = 0;
  private takedowns = 0;
  protected magazineAmmo = 0;
  protected ammo: number;
  protected reloadSpeedRemaining = 0;
  protected fireTimeRemaining = 0;
  protected projectileSize: number;
  protected projectileColor: string;
  protected shouldReload = false;
  protected skillSheet: SkillSheet<WeaponStat>;
  protected unusedSkillPoints = 300;
  protected price: number;
  protected baseStats: WeaponStats;
  protected stats: WeaponStats;

  constructor(config: GunConfig) {
    this.name = config.name;
    this.ammo = config.ammo;
    this.baseStats = { ...config.baseStats };
    this.stats = { ...config.baseStats };
    this.projectileSize = config.projectileSize;
    this.projectileColor = config.projectileColor;
    this.price = config.price;

    this.skillSheet = createSkillSheet(config.skills);

    this.reload();
  }

  protected getNewDirectionAfterRecoil(target: Point) {
    const direction = calculateDirection(player.getPosition(), target);
    const newAngle = Math.random() * 2 * this.stats.recoil - this.stats.recoil;
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
    this.fireTimeRemaining = 60 / this.stats.fireRate;

    this.shoot(target);

    // this.currentRecoil += 15;
  }

  initiateReload() {
    if (this.reloadSpeedRemaining === 0 && this.ammo > 0 && this.magazineAmmo !== this.stats.magSize) {
      this.reloadSpeedRemaining = this.stats.reloadSpeed;
      this.magazineAmmo = 0;
      this.shouldReload = true;
    }
  }

  getStat(stat: WeaponStat, base?: boolean) {
    return (base ? this.baseStats : this.stats)[stat];
  }

  reload() {
    this.magazineAmmo = Math.min(this.stats.magSize, this.ammo);
    this.shouldReload = false;
  }

  tick() {
    this.reloadSpeedRemaining = Math.max(0, this.reloadSpeedRemaining - TICK_DURATION_S);
    this.fireTimeRemaining = Math.max(0, this.fireTimeRemaining - TICK_DURATION_S);
    // this.currentRecoil = Math.max(10, this.currentRecoil - recoilRecoveryPerSecond * TICK_DURATION_S);

    if (this.magazineAmmo === 0 && !this.shouldReload) {
      this.initiateReload();
    }

    if (this.shouldReload && this.reloadSpeedRemaining <= 0) {
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
    return 1 - this.reloadSpeedRemaining / this.stats.reloadSpeed;
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

  getCurrentEffect(stat: WeaponStat) {
    const skill = this.skillSheet[stat];

    if (!skill) {
      return { effect: 0, isAbsolute: true };
    }

    return skill.getEffect(skill.points);
  }

  addTakedown() {
    this.takedowns++;
  }

  addDamageDealt(damage: number) {
    this.damageDealt += damage;
  }

  upgrade(stat: WeaponStat) {
    if (this.unusedSkillPoints < 1) {
      throw new Error("Upgrade method was called without any unused skillpoints");
    }

    this.unusedSkillPoints--;

    const skill = this.skillSheet[stat];
    if (!skill) {
      throw new Error("An upgrade was requested for skill that didn't exist in the gun");
    }

    skill.points++;
    const { effect, isAbsolute } = skill.getEffect(skill.points);

    const newStat = this.baseStats[stat] + (isAbsolute ? effect : effect * this.baseStats[stat]);

    if (stat === "magSize") {
      this.stats[stat] = Math.round(newStat);
    } else {
      this.stats[stat] = newStat;
    }
  }

  getMagazineAmmo() {
    return this.magazineAmmo;
  }

  getPrice() {
    return this.price;
  }

  getSkillSheet() {
    return this.skillSheet;
  }

  getSkillPointsUsed(stat: WeaponStat) {
    return this.skillSheet[stat]?.points || 0;
  }

  getTotalSkillPointsUsed() {
    return Object.values(this.skillSheet).reduce((total, curr) => total + curr.points, 0);
  }

  getUnusedSkillPoints() {
    return this.unusedSkillPoints;
  }

  isReloading() {
    return this.reloadSpeedRemaining > 0;
  }

  isLoadingBulletIntoChamber() {
    return this.fireTimeRemaining > 0;
  }

  protected getDamageForNextBullet() {
    if (Math.random() < this.stats.critChance) {
      return this.stats.damage * 3;
    }

    return this.getFinalStat(Stat.Damage);
  }

  getDamageDealt() {
    return this.damageDealt;
  }

  getTakedowns() {
    return this.takedowns;
  }

  getFinalStat(stat: WeaponStat) {
    if (stat === Stat.MagSize || stat === Stat.Projectiles) {
      return this.stats[stat];
    }

    return this.stats[stat] + this.baseStats[stat] * player.getStat(stat);
  }

  shoot(target: Point) {
    const damage = this.getDamageForNextBullet();

    projectiles.push(
      new NormalProjectile({
        position: player.getPosition(),
        direction: this.getNewDirectionAfterRecoil(target),
        velocity: this.getFinalStat(Stat.Velocity) * TICK_DURATION_S,
        damage: damage,
        range: this.getFinalStat(Stat.Range),
        size: this.projectileSize,
        color: this.projectileColor,
        shotByPlayer: true,
        ownerGun: this,
        isCriticalHit: damage > this.getFinalStat(Stat.Damage),
      })
    );
  }

  onLevelUp(levelIndex: number) {
    const upgrade = this.getLevelBonusStats(levelIndex);

    this.baseStats.damage += upgrade.damage;
    this.baseStats.magSize += upgrade.magSize;
    this.baseStats.reloadSpeed -= upgrade.reloadSpeed;
    this.baseStats.recoil -= upgrade.recoil;
    this.baseStats.velocity += upgrade.velocity;
    this.baseStats.fireRate += upgrade.fireRate;
    this.baseStats.range += upgrade.range;
  }

  abstract getLevelBonusStats(levelIndex: number): { [stat in WeaponStat]: number };
}
