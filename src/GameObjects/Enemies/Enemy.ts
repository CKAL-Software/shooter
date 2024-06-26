import { enemies, currentMap, miscellaneous, numberAnimations, player, projectiles } from "../../Shooter";
import { ANIM_COLLECT_TIME, TICK_DURATION_S } from "../../lib/definitions";
import { MovingObject, MovingObjectConfig } from "../MovingObject";
import { calculateDirection, calculateDistance, drawBall, getObstacleTiles, pathToPoint } from "../../lib/util.canvas";
import { RisingText } from "../RisingText";
import { SNode } from "../../lib/models";
import { intercept, intersects, toUnitVector } from "../../lib/functions";
import { NormalProjectile } from "../Projectiles/NormalProjectile";
import { ExperienceOrb } from "../Items/ExperienceOrb";
import { Gun } from "../../Weapons/Gun";
import { HealthOrb } from "../Items/HealthOrb";
import { AmmoOrb } from "../Items/AmmoOrb";
import { MoneyOrb } from "../Items/MoneyOrb";
import { EnemyStat, Stat } from "../../lib/skillDefinitions";
import { addLog } from "../../lib/GameLog";
import { COLOR_HP_BAR_RED, COLOR_HP_BAR_GREEN } from "../../lib/definitions.colors";

export interface EnemyConfig extends MovingObjectConfig {
  level: number;
}

export abstract class Enemy extends MovingObject {
  abstract name: string;
  private level;
  private pathIndex = 0;
  private currentHp: number;
  private path: SNode[] = [];
  private ticksUntilPathRecalculated = 0;
  private timeUntilShot = this.getTimeUntilNextShot();
  private canSeePlayer = false;
  private spawnTimeLeft = 0;
  private lastDmgAnim: RisingText | undefined = undefined;
  private lastDmgAnimTimeLeft = 0;
  private stats: { [stat in EnemyStat]: number };

  constructor(config: EnemyConfig) {
    super(config);

    this.level = config.level;
    this.stats = this.getStatsForLevel(this.level);
    this.currentHp = this.stats[Stat.MaxHealth];
    this.velocity = this.stats[Stat.MoveSpeed];

    this.color = config.color;
  }

  move() {
    if (this.spawnTimeLeft > 0) {
      return;
    }

    const distanceToPlayer = calculateDistance(this.position, player.getPosition());
    if (
      enemies.find(
        (e) =>
          e.spawnTimeLeft <= 0 &&
          calculateDistance(e.position, this.position) < e.size + this.size &&
          calculateDistance(e.position, player.getPosition()) < distanceToPlayer
      )
    ) {
      return;
    }

    let changeX = 0;
    let changeY = 0;

    if (this.canSeePlayer && calculateDistance(this.position, player.getPosition()) > player.getSize() + this.size) {
      const direction = calculateDirection(this.position, player.getPosition());
      changeX = direction.x * this.velocity;
      changeY = direction.y * this.velocity;
      // this.shiftPosition(changeX, changeY);
      // return;
    } else {
      if (this.path.length === 0) {
        return;
      }

      const direction = calculateDirection(this.position, this.path[0].pos);
      changeX = direction.x * this.velocity;
      changeY = direction.y * this.velocity;
    }

    const [isColliding] = this.checkCollision({ x: this.position.x + changeX, y: this.position.y + changeY });
    if (isColliding) {
      if (!this.checkCollision({ x: this.position.x, y: this.position.y + changeY })[0]) {
        changeX = 0;
        changeY *= Math.SQRT2;
      } else {
        changeY = 0;
        changeX *= Math.SQRT2;
      }
    }

    const unit = toUnitVector({ x: changeX, y: changeY });

    this.shiftPosition(unit.x * this.velocity, unit.y * this.velocity);
  }

  tick() {
    if (this.spawnTimeLeft > 0) {
      this.spawnTimeLeft -= TICK_DURATION_S;
      return;
    }

    this.lastDmgAnimTimeLeft = Math.max(0, this.lastDmgAnimTimeLeft - TICK_DURATION_S);

    this.updateCanSeePlayer();
    this.updateSurroundingObstacles();
    this.updatePath();

    if (this.canSeePlayer) {
      this.timeUntilShot -= TICK_DURATION_S;

      if (this.timeUntilShot <= 0) {
        this.timeUntilShot = this.getTimeUntilNextShot();

        const playerPos = player.getPosition();
        const playerVel = player.getVelocity();

        const leadShotDirection = intercept(
          this.position,
          {
            x: playerPos.x,
            y: playerPos.y,
            vx: playerPos.x * playerVel,
            vy: playerPos.y * playerVel,
          },
          1.5
        );

        projectiles.push(
          new NormalProjectile({
            position: this.position,
            direction: calculateDirection(this.position, leadShotDirection || player.getPosition()),
            velocity: this.stats[Stat.Velocity],
            damage: this.stats[Stat.Damage],
            size: 5,
            range: this.stats[Stat.Range],
            color: "red",
            shotByPlayer: false,
            isCriticalHit: false,
          })
        );
      }
    }

    this.move();
  }

  private getTimeUntilNextShot() {
    return Math.random() * 2 + 1;
  }

  updatePath() {
    this.ticksUntilPathRecalculated--;

    if (this.ticksUntilPathRecalculated <= 0) {
      this.ticksUntilPathRecalculated = 100;
      this.path = pathToPoint(currentMap.getTileOccupation(), this.position, player.getPosition()).slice(1);
    }

    if (this.path.length > 0 && calculateDistance(this.position, this.path[0].pos) <= 1) {
      this.path = this.path.slice(1);
    }
  }

  drawLevel(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getDrawPosition();
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText(`${this.level}`, x + 24, y - (this.size + 2));
  }

  drawHealthBar(ctx: CanvasRenderingContext2D, doubleLength?: boolean) {
    const width = 40;
    const height = 8;

    const drawPos = this.getDrawPosition();

    ctx.beginPath();
    ctx.rect(
      drawPos.x - (width / 2) * (doubleLength ? 2 : 1),
      drawPos.y - (this.size + height + 4),
      width * (doubleLength ? 2 : 1),
      height
    );
    ctx.fillStyle = COLOR_HP_BAR_RED;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(
      drawPos.x - (width / 2) * (doubleLength ? 2 : 1),
      drawPos.y - (this.size + height + 4),
      Math.round(width * (doubleLength ? 2 : 1) * (this.currentHp / this.stats[Stat.MaxHealth])),
      height
    );
    ctx.fillStyle = COLOR_HP_BAR_GREEN;
    ctx.fill();
    ctx.closePath();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const drawPos = this.getDrawPosition();

    if (this.spawnTimeLeft > 0) {
      drawBall(ctx, drawPos, this.size * (1 - this.spawnTimeLeft / 4), this.color);
      return;
    }

    drawBall(ctx, drawPos, this.size, this.color);
    this.drawHealthBar(ctx);
    this.drawLevel(ctx);

    // this.path.forEach((node) => {
    //   ctx.beginPath();
    //   ctx.arc(node.pos.x, node.pos.y, 5, 0, Math.PI * 2);
    //   ctx.fillStyle = "red";
    //   ctx.fill();
    //   ctx.closePath();
    // });

    // ctx.beginPath();
    // ctx.moveTo(this.position.x, this.position.y);
    // const { x, y } = player.getPosition();
    // ctx.lineTo(x, y);
    // ctx.strokeStyle = this.canSeePlayer ? "green" : "red";
    // ctx.stroke();
  }

  updateCanSeePlayer() {
    for (let obstacle of getObstacleTiles(currentMap)) {
      const { x, y } = obstacle.topLeftPoint;
      const vertexDeltas = [
        [0, 0, 50, 0],
        [0, 0, 0, 50],
        [50, 0, 50, 50],
        [0, 50, 50, 50],
      ];

      for (const [startDeltaX, startDeltaY, endDeltaX, endDeltaY] of vertexDeltas) {
        if (
          intersects(
            this.position,
            player.getPosition(),
            { x: x + startDeltaX, y: y + startDeltaY },
            { x: x + endDeltaX, y: y + endDeltaY }
          )
        ) {
          this.canSeePlayer = false;
          return;
        }
      }
    }

    this.canSeePlayer = true;
  }

  inflictDamage(damage: number, isCriticalHit: boolean, ownerGun?: Gun) {
    const chanceOfHighHit = damage - Math.floor(damage);
    const actualDamage = Math.random() < chanceOfHighHit ? Math.ceil(damage) : Math.floor(damage);

    this.currentHp = Math.max(0, this.currentHp - actualDamage);

    if (this.lastDmgAnimTimeLeft > 0) {
      this.lastDmgAnim?.setText(Number(this.lastDmgAnim.getText()) + actualDamage);
    } else {
      const newAnim = new RisingText(this.position, actualDamage, "black", isCriticalHit);
      numberAnimations.push(newAnim);
      this.lastDmgAnim = newAnim;
    }
    this.lastDmgAnimTimeLeft = ANIM_COLLECT_TIME;

    addLog("hit");

    if (this.currentHp <= 0) {
      this.die(ownerGun);
    }

    ownerGun?.addDamageDealt(actualDamage);
    player.addDamageDealt(actualDamage);
  }

  private die(ownerGun?: Gun) {
    this.shouldDraw = false;

    player.addTakedown();
    player.addExperience(this.stats[Stat.Reward]);
    ownerGun?.addTakedown();
    ownerGun?.addExperience(this.stats[Stat.Reward]);

    // if (Math.random() < 0.05) {
    if (Math.random() < 1) {
      // const numExpOrbs = Math.floor(Math.random() * 6) + 1;
      const numExpOrbs = 1;
      for (let i = 0; i < numExpOrbs; i++) {
        const exp = Math.round(Math.random() * this.stats[Stat.Reward] * 4);

        miscellaneous.push(new ExperienceOrb(this.position, exp));
      }
    }

    if (Math.random() < 0.03) {
      miscellaneous.push(new HealthOrb(this.position, 3));
    }

    if (ownerGun && Math.random() < 0.1) {
      miscellaneous.push(new AmmoOrb(this.position, 10, ownerGun.getName()));
    }

    if (Math.random() < 0.1) {
      miscellaneous.push(new MoneyOrb(this.position, 10));
    }

    // const randomDirection = changeDirection({ x: 0, y: 1 }, Math.round(Math.random() * 360));
    // miscellaneous.push(new Money(this.reward, this.position, randomDirection));
  }

  hasSpawned() {
    return this.spawnTimeLeft <= 0;
  }

  getSize() {
    return this.size;
  }

  getCurrentHp() {
    return this.currentHp;
  }

  getPathIndex() {
    return this.pathIndex;
  }

  abstract getStatsForLevel(level: number): { [stat in EnemyStat]: number };
}
