import { allEnemies, gameStats, projectiles, towers } from "../../Shooter";
import { calculateDirection, calculateDistance, drawTowerTile, tileToPixels } from "../../lib/canvasFunctions";
import { SELL_PERCENTAGE, Point, TILE_SIZE, TICK_DURATION, TargetingMode } from "../../lib/definitions";
import { TowerSpecification } from "../../Definitions/TowerSpecifications";
import { Enemy } from "../Enemies/Enemy";
import { GameObject } from "../GameObject";
import { HashtagProjectile } from "../Projectiles/HashtagProjectile";
import { HeatSeekingProjectile } from "../Projectiles/HeatSeekingProjectile";
import { NormalProjectile } from "../Projectiles/NormalProjectile";
import { SlowingProjectile } from "../Projectiles/SlowingProjectile";
import { PiercingProjectile } from "../Projectiles/PiercingProjectile";

export abstract class Tower extends GameObject {
  protected spec: TowerSpecification;
  protected tilePosition: Point = { x: -100, y: -100 };
  protected position: Point;
  protected reloadCounter: number = 0;
  private moneyInvested: number;
  private drawRange: boolean = true;
  private isPlaced: boolean = false;
  private damageDealt: number = 0;
  private notifyUI: () => void;
  protected level: number = 0;
  private drawRangeRed: boolean = false;
  public shouldDraw: boolean = true;
  private targetingMode: TargetingMode = "First";

  constructor(specification: TowerSpecification, notifyUI: () => void) {
    super();

    this.spec = specification;
    this.position = tileToPixels(this.tilePosition);
    this.moneyInvested = specification.prices[0];

    this.notifyUI = notifyUI;
  }

  tick() {
    if (!this.isPlaced) {
      return;
    }

    if (this.reloadCounter <= 0) {
      const target = this.calculateTarget();
      if (target) {
        this.shoot(target);
      }
    }

    this.reloadCounter--;
  }

  shoot(target: Enemy) {
    const { velocities, damages, size, color, slows, projectileConstructor } = this.spec.projectileSpec;

    if (projectileConstructor === HashtagProjectile || projectileConstructor === HeatSeekingProjectile) {
      projectiles.push(
        new projectileConstructor(this, velocities[this.level], damages[this.level], size, color, target)
      );
    } else if (projectileConstructor === SlowingProjectile) {
      projectiles.push(
        new projectileConstructor(
          this,
          velocities[this.level],
          damages[this.level],
          slows![this.level],
          size,
          color,
          target
        )
      );
    } else if (projectileConstructor === NormalProjectile || projectileConstructor === PiercingProjectile) {
      projectiles.push(
        new projectileConstructor(
          this,
          velocities[this.level],
          damages[this.level],
          size,
          color,
          calculateDirection(this.position, target.getPosition())
        )
      );
    }

    this.reloadCounter = 60000 / (this.spec.roundsPerMins[this.level] * TICK_DURATION * 2);
  }

  sell() {
    this.shouldDraw = false;
    gameStats.money += this.getSellPrice();
  }

  addDamageDealt(damageDealt: number) {
    this.damageDealt += damageDealt;
    this.notifyUI();
  }

  getDamageDealt() {
    return this.damageDealt;
  }

  getPosition() {
    return this.position;
  }

  getTargetingMode() {
    return this.targetingMode;
  }

  setTargetingMode(targetingMode: TargetingMode) {
    this.targetingMode = targetingMode;
  }

  getSellPrice() {
    return Math.round(this.moneyInvested * SELL_PERCENTAGE);
  }

  getUpgradePrice() {
    return this.spec.prices[this.level + 1];
  }

  setDrawRangeRed(drawRangeRed: boolean) {
    this.drawRangeRed = drawRangeRed;
  }

  canPlace() {
    const existingTowerIndex = towers.findIndex(
      (tower) =>
        tower !== this &&
        tower.getTilePosition().x === this.tilePosition.x &&
        tower.getTilePosition().y === this.tilePosition.y
    );

    if (existingTowerIndex !== -1) {
      return false;
    }

    if (gameStats.money < this.spec.prices[0]) {
      return false;
    }

    return true;
  }

  place() {
    this.isPlaced = true;
    this.drawRange = false;

    gameStats.money -= this.spec.prices[0];
  }

  getLevel() {
    return this.level;
  }

  tryDrawRange(ctx: CanvasRenderingContext2D) {
    if (this.drawRange) {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, (this.spec.ranges[this.level] + 0.5) * TILE_SIZE, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.drawRangeRed ? 255 : 0},0,${this.drawRangeRed ? 0 : 255},0.2)`;
      ctx.fill();
      ctx.closePath();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.tryDrawRange(ctx);
    this.drawTower(ctx);
    this.drawLevel(ctx);
  }

  drawLevel(ctx: CanvasRenderingContext2D) {
    ctx.font = "20px Cairo";
    ctx.fillStyle = "#222222";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.level + 1 + "", this.position.x, this.position.y + 3);
  }

  drawTower(ctx: CanvasRenderingContext2D) {
    drawTowerTile(ctx, this.tilePosition.x, this.tilePosition.y, this.spec.color);
  }

  levelUp() {
    this.level++;
    gameStats.money -= this.spec.prices[this.level];
    this.moneyInvested += this.spec.prices[this.level];
    this.notifyUI();
  }

  getSpec() {
    return this.spec;
  }

  setDrawRange(drawRange: boolean) {
    this.drawRange = drawRange;
  }

  getTilePosition() {
    return this.tilePosition;
  }

  getPrice() {
    return this.spec.prices[this.level];
  }

  setTilePosition(tilePosition: Point) {
    this.tilePosition = tilePosition;
    this.position = tileToPixels(tilePosition);
    if (this.tilePosition.x < 0 || this.tilePosition.x > 19 || this.tilePosition.y < 0 || this.tilePosition.y > 19) {
      this.shouldDraw = false;
    } else {
      this.shouldDraw = true;
    }
  }

  protected getEnemiesInRange() {
    const enemiesInRange: { enemy: Enemy; distance: number }[] = [];
    allEnemies().forEach((enemy) => {
      const distance = calculateDistance(enemy.getPosition(), this.position);

      if (distance - enemy.getSize() <= (this.spec.ranges[this.level] + 0.5) * TILE_SIZE) {
        enemiesInRange.push({ enemy, distance });
      }
    });

    return enemiesInRange;
  }

  protected calculateTarget(): Enemy | undefined {
    const enemiesInRange = this.getEnemiesInRange();

    if (enemiesInRange.length === 0) {
      return undefined;
    }

    if (this.targetingMode === "Closest") {
      let closestSoFar = undefined;
      let smallestDistance = Number.MAX_SAFE_INTEGER;

      enemiesInRange.forEach((enemy) => {
        if (enemy.distance < smallestDistance) {
          closestSoFar = enemy.enemy;
          smallestDistance = enemy.distance;
        }
      });

      return closestSoFar;
    }
    if (this.targetingMode === "Farthest") {
      let farthestSoFar = undefined;
      let longestDistance = Number.MIN_SAFE_INTEGER;

      enemiesInRange.forEach((enemy) => {
        if (enemy.distance > longestDistance) {
          farthestSoFar = enemy.enemy;
          longestDistance = enemy.distance;
        }
      });

      return farthestSoFar;
    }

    if (this.targetingMode === "Random") {
      return enemiesInRange[Math.floor(Math.random() * enemiesInRange.length)].enemy;
    }

    if (this.targetingMode === "Weakest") {
      let weakestSoFar = undefined;
      let smallestHp = Number.MAX_SAFE_INTEGER;

      enemiesInRange.forEach((enemy) => {
        if (enemy.enemy.getCurrentHp() < smallestHp) {
          weakestSoFar = enemy.enemy;
          smallestHp = enemy.enemy.getCurrentHp();
        }
      });

      return weakestSoFar;
    }

    if (this.targetingMode === "Toughest") {
      let strongestSoFar = undefined;
      let largestHp = Number.MIN_SAFE_INTEGER;

      enemiesInRange.forEach((enemy) => {
        if (enemy.enemy.getCurrentHp() > largestHp) {
          strongestSoFar = enemy.enemy;
          largestHp = enemy.enemy.getCurrentHp();
        }
      });

      return strongestSoFar;
    }

    if (this.targetingMode === "First") {
      let firstSoFar = undefined;
      let first = 0;

      enemiesInRange.forEach((enemy) => {
        if (enemy.enemy.getPathIndex() > first) {
          firstSoFar = enemy.enemy;
          first = enemy.enemy.getPathIndex();
        }
      });

      return firstSoFar;
    }

    if (this.targetingMode === "Last") {
      let lastSoFar = undefined;
      let last = Number.MAX_SAFE_INTEGER;

      enemiesInRange.forEach((enemy) => {
        if (enemy.enemy.getPathIndex() < last) {
          lastSoFar = enemy.enemy;
          last = enemy.enemy.getPathIndex();
        }
      });

      return lastSoFar;
    }
  }
}
